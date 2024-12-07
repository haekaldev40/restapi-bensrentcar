// const Queue = require('bull');
// const { sendInvoiceBooking } = require('./sendInvoiceBooking');

// const emailQueue = new Queue('email', {
//     redis: {
//         host: '127.0.0.1',
//         port: 6379
//     }
// });

// emailQueue.process(async (job, done) => {
//     const { user_email, car_title, amount, img_transcation, startDate, endDate, duration, rentalPrice } = job.data;
//     await sendInvoiceBooking(user_email, car_title, amount, img_transcation, startDate, endDate, duration, rentalPrice);
//     done();
// });

// const addEmailToQueue = (data) => {
//     emailQueue.add(data);
// };

// module.exports = {
//     addEmailToQueue
// };
