const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const translate = require('translate-google');

const app = express();
// Minimal .env loader (no additional dependency required)
const fs = require('fs');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['\"]|['\"]$/g, '');
  }
}
const port = process.env.PORT || 3000;

// Mailchimp API bilgileri
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || 'us11';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS ayarları
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || true, // Canlı ortamda FRONTEND_ORIGIN ile sınırlandırın
    methods: ['GET', 'POST'], // İzin verilen HTTP metodları
    allowedHeaders: ['Content-Type'], // İzin verilen headerlar
}));

// Statik dosyalar (frontend)
app.use(express.static(path.join(__dirname, '../../front')));

// Mailchimp API ile abone ekleme veya durumu güncelleme
app.post('/Newsletter/Insert', async (req, res) => {
    const email = req.body.Email;

    if (!email) {
        return res.status(400).json({ message: 'E-posta adresi gerekli.' });
    }

    // Mailchimp'in listede bulunan e-posta adreslerini belirlemek için MD5 hash kullanır
    const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

    try {
        // Abonenin mevcut olup olmadığını kontrol etme
        const getResponse = await axios.get(`https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}`, {
            headers: {
                'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (getResponse.status === 200) {
            // Abone mevcut, durumu güncelle
            const patchResponse = await axios.patch(`https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}`, {
                status: 'subscribed',
            }, {
                headers: {
                    'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            if (patchResponse.status === 200) {
                sendWelcomeEmail(email);
                return res.status(200).json({ message: 'Abonelik durumu güncellendi ve e-posta gönderildi.' });
            } else {
                return res.status(patchResponse.status).json({ message: 'Durum güncellenirken bir hata oluştu.' });
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Abone bulunamadı, yeni bir abone oluştur
            try {
                const postResponse = await axios.post(`https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/`, {
                    email_address: email,
                    status: 'subscribed',
                }, {
                    headers: {
                        'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (postResponse.status === 200) {
                    sendWelcomeEmail(email);
                    return res.status(200).json({ message: 'Yeni abonelik başarılı ve e-posta gönderildi.' });
                } else {
                    return res.status(postResponse.status).json({ message: 'Bir hata oluştu.' });
                }
            } catch (postError) {
                console.error('Hata (Yeni abone ekleme): ', postError);
                return res.status(500).json({ message: 'Bir hata oluştu.' });
            }
        } else {
            console.error('Hata (Abone kontrolü): ', error);
            return res.status(500).json({ message: 'Bir hata oluştu.' });
        }
    }
});

// E-posta gönderme fonksiyonu
const sendWelcomeEmail = (email) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Aboneliğiniz Başarıyla Tamamlandı!',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="text-align: center;">
                <img src="https://cagbas-site.pages.dev/_assets/images/cagbas-logo.svg" alt="ÇAĞBAŞ Logo" style="max-width: 150px; margin-bottom: 20px;">
            </div>
            <h2 style="color: #333; text-align: center;">ÇAĞBAŞ e-bültenine hoş geldiniz!</h2>
            <p style="color: #555; text-align: center;">Merhaba,</p>
            <p style="color: #555; text-align: center;">E-bültenimize abone olduğunuz için teşekkür ederiz. Sizleri en son haberler, güncellemeler ve özel teklifler hakkında bilgilendireceğiz.</p>
            <p style="color: #555; text-align: center;">Güncellemeler için takipte kalın. Herhangi bir sorunuz varsa, <a href="mailto:cagbas.2026@gmail.com" style="color: #3498db;">bizimle iletişime geçin</a>.</p>
            <p style="color: #777; text-align: center; font-size: 12px;">Bu mesajı istemiyorsanız <a href="https://cagbas-site.pages.dev/unsubscribe.html?email=${encodeURIComponent(email)}" style="color: #3498db;">abonelikten çıkabilirsiniz</a>.</p>
        </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('E-posta gönderilirken hata oluştu:', error);
        } else {
            console.log('E-posta başarıyla gönderildi:', info.response);
        }
    });
}; 

// Unsubscribe işlemi
app.get('/unsubscribe/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
        const response = await axios.delete(`https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${emailHash}`, {
            headers: {
                'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 204) { // Mailchimp API'si başarılı silme işleminde 204 No Content döner
            res.send('Abonelikten başarıyla çıkıldı.');
        } else {
            res.status(response.status).send('Bir hata oluştu.');
        }
    } catch (error) {
        console.error('Hata: ', error);
        res.status(500).send('Bir hata oluştu.');
    }
});

// E-posta gönderme rotası
app.post('/send-email', (req, res) => {
    const { FullName, Email, Phone, Subject, Message } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let mailOptions = {
        from: Email,
        to: 'cagbas.2026@gmail.com',
        //cc:'firmanın ikinci maili veya sahibinin maili yazılabilir. ikinci alıcı.',
        subject: `Yeni İletişim Formu: ${Subject}`,
        text: `İsim Soyisim: ${FullName}\nEmail: ${Email}\nTelefon: ${Phone}\n\nMesaj:\n${Message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Mesaj gönderilirken bir hata oluştu.');
        }
        res.status(200).send('Mesajınız başarıyla gönderildi.');
    });
});

app.post('/translate', async(req, res) => {
    const { msg, to } = req.body;

    // Çeviri işlevinizin HTML etiketlerini desteklediğinden emin olun.
    try {
        const translation = await translate(msg, { from: 'auto', to: to });

        // Çeviri sonrası içeriği bir HTML formatında döndür
        res.status(200).json({ translation: translation });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});


// Frontend için rotayı ayarlayın
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front/_assets/js/main.js'));
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});