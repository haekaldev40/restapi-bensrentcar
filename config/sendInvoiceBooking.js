const express = require('express')
const nodemailer = require('nodemailer')
const path = require('path')
const Mailgen = require('mailgen')
const fs = require('fs');
const sizeOf = require('image-size');
const PDFDocument = require('pdfkit');
require('pdfkit-table');
const moment = require('moment');
const { default: PDFDocumentWithTables } = require('pdfkit-table');

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

const createTransactionPDF = (carTitle, startDate, endDate, duration, rentalPrice, totalRentalPrice) => {
    const doc = new PDFDocumentWithTables();
    const fileName = `transaction_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../public/transactions', fileName);

    // Create directory if it doesn't exist
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    doc.pipe(fs.createWriteStream(filePath));

    // Tambahkan logo
    const logoPath = path.join(__dirname, '../public/logobens.png'); // Path logo rental mobil
    const logoWidth = 300;
    const pageWidth = doc.page.width;
    const logoX = (pageWidth - logoWidth) / 2; // Menempatkan logo di tengah halaman
    doc.image(logoPath, logoX, 45, { width: logoWidth })
       
    doc.moveDown(15); // Menambah jarak bawah lebih besar

    doc.fontSize(12)
    .text('Hi,', 50, doc.y)
    .moveDown(0.5)
    .text('Terima kasih, pembayaran anda sudah berhasil, berikut untuk rincian pembayaran anda :', 50, doc.y)
    .moveDown(2);

    // Format tanggal
    const formattedStartDate = moment(startDate).format('DD/MM/YYYY');
    const formattedEndDate = moment(endDate).format('DD/MM/YYYY');

    const table = {
        headers: [],
        rows: [
            ['Nama Mobil', carTitle], 
            ['Tanggal Mulai,', formattedStartDate], 
            ['Tanggal Akhir', formattedEndDate], 
            ['Durasi', duration], 
            ['Harga Sewa', formatRupiah(rentalPrice)], 
            ['Total Harga Sewa', formatRupiah(totalRentalPrice)],
        ],
    }

    const startY = doc.y;
    table.rows.forEach(([key, value], idx) => {
        doc.font('Helvetica-Oblique').text(key, 100, startY + idx * 20); // Key dengan font italic
        doc.text(':', 210, startY + idx * 20);
        doc.text(value, 240, startY + idx * 20); // Value dengan font italic

    });



    doc.end();
    // Tambahkan tabel
    // const tableTop = 150;
    // const itemNameX = 50;
    // const itemValueX = 200;

    // doc.fontSize(12).text("Nama Mobil:", itemNameX, tableTop);
    // doc.text(carTitle, itemValueX, tableTop);

    // doc.text("Tanggal Mulai:", itemNameX, tableTop + 20);
    // doc.text(formattedStartDate, itemValueX, tableTop + 20);

    // doc.text("Tanggal Akhir:", itemNameX, tableTop + 40);
    // doc.text(formattedEndDate, itemValueX, tableTop + 40);

    // doc.text("Durasi:", itemNameX, tableTop + 60);
    // doc.text(`${duration} hari`, itemValueX, tableTop + 60);

    // doc.text("Harga Sewa:", itemNameX, tableTop + 80);
    // doc.text(formatRupiah(rentalPrice), itemValueX, tableTop + 80);

    // doc.text("Total Harga Sewa:", itemNameX, tableTop + 100);
    // doc.text(formatRupiah(totalRentalPrice), itemValueX, tableTop + 100);

    // doc.end();

    return filePath;
};


const sendInvoiceBooking = async (user_email, car_title, amount, img_transcation, startDate, endDate, duration, rentalPrice) => {
    const userName = user_email.split('@')[0];

    const config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SMTP,
            pass: process.env.PASSWORD_SMTP
        }
    }
    
    const transporter = nodemailer.createTransport(config)
    
    const MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Mailgen',
            link: 'https://mailgen.js/',
            copyright: 'Copyright © 2024 Bens Rent Car. All rights reserved.'
        }
    })
    
    const response = {
        body: {
            name: `${userName}`,
            intro: "Pembayaran anda diterima.",
            table: {
                data: [
                    {
                        title: car_title,
                        price: `${amount}`
                    }
                ]
            },
            outro: "Untuk melihat informasi pembayaran, silahkan cek pada menu notifikasi."
        }
    }
    
    const mail = MailGenerator.generate(response)
    
    // Menggunakan path absolut untuk file lampiran
    const attachmentPath = path.resolve(__dirname, '../public/uploads/', img_transcation);
    const transactionFilePath = createTransactionPDF(car_title, startDate, endDate, duration, rentalPrice, amount);
    console.log('Attachment path:', attachmentPath); // Logging untuk memastikan path benar
    
    const message = {
        from: process.env.EMAIL_SMTP,
        to: user_email,
        subject: "Booking Order",
        html: mail,
        attachments: [
            {
                filename: path.basename(img_transcation),
                path: attachmentPath,
                contentType: 'image/png'
            },
            {
                filename: path.basename(transactionFilePath),
                path: transactionFilePath,
                contentType: 'application/pdf'
            }
        ]
    }

    try {
        await transporter.sendMail(message)
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending email', error.message)
    }
}

module.exports = {
    sendInvoiceBooking
}
