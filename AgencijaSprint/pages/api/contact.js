export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { ime, email, usluga, poruka } = req.body;

    // Ovde bi išla implementacija slanja emaila
    // Na primer, preko nodemailer-a ili nekog email servisa

    // Simuliramo uspešno slanje
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(200).json({ message: 'Email successfully sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
} 