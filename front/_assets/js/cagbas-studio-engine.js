/**
 * ÇAĞBAŞ AI STUDIO — Editor Foundation
 * Shared, framework-free state engine for visual, written and voice editing.
 * This module stores structured design data only; it never executes AI-provided code or HTML.
 */

const BLOCK_TYPES = new Set(["navbar", "hero", "features", "cta", "gallery", "pricing", "contact"]);
const THEMES = new Set(["white", "slate", "dark"]);
const MAX_PAGES = 30;
const MAX_BLOCKS_PER_PAGE = 100;
const MAX_HISTORY = 80;
const MAX_TEXT = 2000;

const clone = value => JSON.parse(JSON.stringify(value));
const makeId = prefix => prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
const cleanText = (value, max = MAX_TEXT) => String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, max);
const isHexColor = value => typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

function normalizeBlock(block) {
  if (!block || !BLOCK_TYPES.has(block.type)) throw new Error("UNSUPPORTED_BLOCK_TYPE");
  const result = clone(block);
  result.id = cleanText(result.id || makeId("block"), 100);
  result.name = cleanText(result.name || result.type, 100);
  for (const key of ["brand", "cta", "badge", "title", "subtitle", "primaryBtn", "secondaryBtn", "heading", "buttonText", "submitText"]) {
    if (key in result) result[key] = cleanText(result[key]);
  }
  for (const key of ["links"]) {
    if (Array.isArray(result[key])) result[key] = result[key].slice(0, 30).map(x => cleanText(x, 120));
  }
  for (const key of ["items", "cards", "plans"]) {
    if (Array.isArray(result[key])) {
      result[key] = result[key].slice(0, 30).map(item => {
        const clean = {};
        for (const [k, v] of Object.entries(item || {})) clean[k] = cleanText(v, 500);
        return clean;
      });
    }
  }
  return result;
}

function normalizePage(page, index = 0) {
  const blocks = Array.isArray(page?.blocks) ? page.blocks : [];
  if (blocks.length > MAX_BLOCKS_PER_PAGE) throw new Error("PAGE_BLOCK_LIMIT");
  return {
    id: cleanText(page?.id || makeId("page"), 100),
    name: cleanText(page?.name || (index === 0 ? "Ana Sayfa" : "Yeni Sayfa"), 80),
    slug: cleanText(page?.slug || (index === 0 ? "/" : "sayfa-" + (index + 1)), 100),
    blocks: blocks.map(normalizeBlock)
  };
}

export class CagbasStudioEngine {
  constructor(options = {}) {
    const legacyBlocks = Array.isArray(options.blocks) ? options.blocks : [];
    const pages = Array.isArray(options.pages) && options.pages.length
      ? options.pages.map(normalizePage)
      : [normalizePage({ id: makeId("page"), name: "Ana Sayfa", slug: "/", blocks: legacyBlocks })];

    if (pages.length > MAX_PAGES) throw new Error("PAGE_LIMIT");
    this.state = {
      pages,
      currentPageId: pages[0].id,
      theme: THEMES.has(options.theme) ? options.theme : "white",
      accent: isHexColor(options.accent) ? options.accent : "#4f46e5",
      selectedBlockId: null
    };
    this.past = [];
    this.future = [];
    this.listeners = new Set();
    this._emit("init");
  }

  get currentPage() {
    return this.state.pages.find(page => page.id === this.state.currentPageId) || this.state.pages[0];
  }

  get blocks() { return this.currentPage.blocks; }

  subscribe(listener) {
    if (typeof listener !== "function") throw new Error("LISTENER_REQUIRED");
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _emit(reason) {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      try { listener(snapshot, reason); } catch (error) { console.error("Studio listener failed", error); }
    }
  }

  getSnapshot() {
    return clone({
      ...this.state,
      currentPage: this.currentPage,
      canUndo: this.past.length > 0,
      canRedo: this.future.length > 0
    });
  }

  _checkpoint() {
    this.past.push(clone(this.state));
    if (this.past.length > MAX_HISTORY) this.past.shift();
    this.future = [];
  }

  _commit(reason) { this._emit(reason); }

  addBlock(block) {
    if (this.blocks.length >= MAX_BLOCKS_PER_PAGE) throw new Error("PAGE_BLOCK_LIMIT");
    const next = normalizeBlock(block);
    if (this.blocks.some(item => item.id === next.id)) next.id = makeId("block");
    this._checkpoint();
    this.blocks.push(next);
    this.state.selectedBlockId = next.id;
    this._commit("block:add");
    return clone(next);
  }

  updateBlock(blockId, patch) {
    const index = this.blocks.findIndex(block => block.id === blockId);
    if (index < 0) throw new Error("BLOCK_NOT_FOUND");
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) throw new Error("INVALID_PATCH");
    const allowed = new Set(["name", "brand", "cta", "badge", "title", "subtitle", "primaryBtn", "secondaryBtn", "heading", "buttonText", "submitText", "links", "items", "cards", "plans"]);
    const safePatch = {};
    for (const [key, value] of Object.entries(patch)) {
      if (!allowed.has(key)) throw new Error("FIELD_NOT_ALLOWED:" + key);
      safePatch[key] = value;
    }
    const updated = normalizeBlock({ ...this.blocks[index], ...safePatch });
    this._checkpoint();
    this.blocks[index] = updated;
    this._commit("block:update");
    return clone(updated);
  }

  removeBlock(blockId) {
    const index = this.blocks.findIndex(block => block.id === blockId);
    if (index < 0) throw new Error("BLOCK_NOT_FOUND");
    this._checkpoint();
    this.blocks.splice(index, 1);
    if (this.state.selectedBlockId === blockId) this.state.selectedBlockId = this.blocks[Math.max(0, index - 1)]?.id || null;
    this._commit("block:remove");
  }

  moveBlock(blockId, toIndex) {
    const fromIndex = this.blocks.findIndex(block => block.id === blockId);
    if (fromIndex < 0) throw new Error("BLOCK_NOT_FOUND");
    const target = Math.max(0, Math.min(this.blocks.length - 1, Number(toIndex)));
    if (!Number.isInteger(target)) throw new Error("INVALID_INDEX");
    if (target === fromIndex) return;
    this._checkpoint();
    const [block] = this.blocks.splice(fromIndex, 1);
    this.blocks.splice(target, 0, block);
    this._commit("block:move");
  }

  duplicateBlock(blockId) {
    const index = this.blocks.findIndex(block => block.id === blockId);
    if (index < 0) throw new Error("BLOCK_NOT_FOUND");
    if (this.blocks.length >= MAX_BLOCKS_PER_PAGE) throw new Error("PAGE_BLOCK_LIMIT");
    const copy = clone(this.blocks[index]);
    copy.id = makeId("block");
    copy.name = cleanText(copy.name + " (Kopya)", 100);
    this._checkpoint();
    this.blocks.splice(index + 1, 0, copy);
    this.state.selectedBlockId = copy.id;
    this._commit("block:duplicate");
    return clone(copy);
  }

  selectBlock(blockId) {
    if (blockId !== null && !this.blocks.some(block => block.id === blockId)) throw new Error("BLOCK_NOT_FOUND");
    this.state.selectedBlockId = blockId;
    this._commit("block:select");
  }

  setTheme(theme) {
    if (!THEMES.has(theme)) throw new Error("INVALID_THEME");
    if (theme === this.state.theme) return;
    this._checkpoint();
    this.state.theme = theme;
    this._commit("theme:set");
  }

  setAccent(color) {
    if (!isHexColor(color)) throw new Error("INVALID_COLOR");
    if (color === this.state.accent) return;
    this._checkpoint();
    this.state.accent = color;
    this._commit("accent:set");
  }

  addPage(name = "Yeni Sayfa", slug = "") {
    if (this.state.pages.length >= MAX_PAGES) throw new Error("PAGE_LIMIT");
    const safeName = cleanText(name, 80) || "Yeni Sayfa";
    const baseSlug = cleanText(slug || safeName.toLocaleLowerCase("tr-TR")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), 100) || "sayfa";
    const used = new Set(this.state.pages.map(page => page.slug));
    let finalSlug = baseSlug;
    let suffix = 2;
    while (used.has(finalSlug) || finalSlug === "/") finalSlug = baseSlug + "-" + suffix++;
    this._checkpoint();
    const page = normalizePage({ id: makeId("page"), name: safeName, slug: finalSlug, blocks: [] }, this.state.pages.length);
    this.state.pages.push(page);
    this.state.currentPageId = page.id;
    this.state.selectedBlockId = null;
    this._commit("page:add");
    return clone(page);
  }

  renamePage(pageId, name) {
    const page = this.state.pages.find(item => item.id === pageId);
    if (!page) throw new Error("PAGE_NOT_FOUND");
    const safeName = cleanText(name, 80);
    if (!safeName) throw new Error("PAGE_NAME_REQUIRED");
    this._checkpoint();
    page.name = safeName;
    this._commit("page:rename");
  }

  switchPage(pageId) {
    if (!this.state.pages.some(page => page.id === pageId)) throw new Error("PAGE_NOT_FOUND");
    this.state.currentPageId = pageId;
    this.state.selectedBlockId = null;
    this._commit("page:switch");
  }

  duplicatePage(pageId = this.state.currentPageId) {
    if (this.state.pages.length >= MAX_PAGES) throw new Error("PAGE_LIMIT");
    const source = this.state.pages.find(page => page.id === pageId);
    if (!source) throw new Error("PAGE_NOT_FOUND");
    this._checkpoint();
    const page = clone(source);
    page.id = makeId("page");
    page.name = cleanText(source.name + " (Kopya)", 80);
    page.slug = source.slug === "/" ? "ana-sayfa-kopya" : source.slug + "-kopya";
    const used = new Set(this.state.pages.map(item => item.slug));
    let base = page.slug, n = 2;
    while (used.has(page.slug)) page.slug = base + "-" + n++;
    page.blocks = page.blocks.map(block => ({ ...block, id: makeId("block") }));
    this.state.pages.push(page);
    this.state.currentPageId = page.id;
    this.state.selectedBlockId = null;
    this._commit("page:duplicate");
    return clone(page);
  }

  deletePage(pageId) {
    if (this.state.pages.length <= 1) throw new Error("LAST_PAGE_CANNOT_BE_DELETED");
    const index = this.state.pages.findIndex(page => page.id === pageId);
    if (index < 0) throw new Error("PAGE_NOT_FOUND");
    this._checkpoint();
    this.state.pages.splice(index, 1);
    if (this.state.currentPageId === pageId) this.state.currentPageId = this.state.pages[Math.max(0, index - 1)].id;
    this.state.selectedBlockId = null;
    this._commit("page:delete");
  }

  undo() {
    if (!this.past.length) return false;
    this.future.push(clone(this.state));
    this.state = this.past.pop();
    this._commit("history:undo");
    return true;
  }

  redo() {
    if (!this.future.length) return false;
    this.past.push(clone(this.state));
    this.state = this.future.pop();
    this._commit("history:redo");
    return true;
  }

  /**
   * Apply a validated operation list from the AI command planner.
   * Supported operations are deliberately allow-listed; arbitrary code/HTML is rejected.
   */
  applyOperations(operations) {
    if (!Array.isArray(operations) || operations.length < 1 || operations.length > 20) {
      throw new Error("INVALID_OPERATION_LIST");
    }
    const before = clone(this.state);
    const pastBefore = clone(this.past);
    const futureBefore = clone(this.future);
    const results = [];
    try {
      for (const operation of operations) {
        if (!operation || typeof operation !== "object") throw new Error("INVALID_OPERATION");
        switch (operation.type) {
          case "add_block": {
            if (!BLOCK_TYPES.has(operation.blockType)) throw new Error("UNSUPPORTED_BLOCK_TYPE");
            const block = operation.block && typeof operation.block === "object"
              ? { ...operation.block, type: operation.blockType }
              : defaultBlock(operation.blockType);
            results.push(this.addBlock(block).id);
            break;
          }
          case "update_block":
            this.updateBlock(operation.blockId, operation.patch);
            results.push(operation.blockId);
            break;
          case "remove_block":
            this.removeBlock(operation.blockId);
            results.push(operation.blockId);
            break;
          case "move_block":
            this.moveBlock(operation.blockId, operation.toIndex);
            results.push(operation.blockId);
            break;
          case "duplicate_block":
            results.push(this.duplicateBlock(operation.blockId).id);
            break;
          case "set_theme":
            this.setTheme(operation.theme);
            results.push(operation.theme);
            break;
          case "set_accent":
            this.setAccent(operation.color);
            results.push(operation.color);
            break;
          case "add_page":
            results.push(this.addPage(operation.name, operation.slug).id);
            break;
          case "rename_page":
            this.renamePage(operation.pageId, operation.name);
            results.push(operation.pageId);
            break;
          case "switch_page":
            this.switchPage(operation.pageId);
            results.push(operation.pageId);
            break;
          case "delete_page":
            this.deletePage(operation.pageId);
            results.push(operation.pageId);
            break;
          default:
            throw new Error("UNSUPPORTED_OPERATION:" + cleanText(operation.type, 60));
        }
      }
      return results;
    } catch (error) {
      this.state = before;
      this.past = pastBefore;
      this.future = futureBefore;
      this._commit("operations:rejected");
      throw error;
    }
  }

  exportProject() {
    return clone({
      schemaVersion: 1,
      platform: "cagbas-ai-studio",
      updatedAt: new Date().toISOString(),
      pages: this.state.pages,
      currentPageId: this.state.currentPageId,
      theme: this.state.theme,
      accent: this.state.accent
    });
  }
}

function defaultBlock(type) {
  const id = makeId("block");
  const presets = {
    navbar: { id, type, name: "Üst Menü", brand: "MARKAM", links: ["Ana Sayfa", "Hizmetler", "İletişim"], cta: "Teklif Al" },
    hero: { id, type, name: "Hero Başlık", badge: "MERHABA", title: "Markanız için modern bir web sitesi", subtitle: "Hikâyenizi dijital dünyaya taşıyın.", primaryBtn: "Başlayın", secondaryBtn: "Detayları Gör" },
    features: { id, type, name: "Özellik Kartları", heading: "Hizmetlerimiz", items: [{title:"Hizmet 1",desc:"Hizmet açıklaması"},{title:"Hizmet 2",desc:"Hizmet açıklaması"},{title:"Hizmet 3",desc:"Hizmet açıklaması"}] },
    cta: { id, type, name: "Çağrı Alanı", heading: "Projenizi başlatalım", subtitle: "Bizimle iletişime geçin.", buttonText: "İletişime Geç" },
    gallery: { id, type, name: "Galeri", heading: "Çalışmalarımız", cards: [{tag:"PROJE",title:"Proje 1",desc:"Proje açıklaması"}] },
    pricing: { id, type, name: "Fiyat / Plan", heading: "Paketler", plans: [{name:"Başlangıç",price:"Teklif Al",desc:"Paket açıklaması"}] },
    contact: { id, type, name: "İletişim Formu", heading: "Bize Ulaşın", subtitle: "Mesajınızı iletin.", submitText: "Gönder" }
  };
  return presets[type];
}
