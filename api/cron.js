export default async function handler(req, res) {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).end('Unauthorized');
    }
  
    const endpoint = 'https://email-birthday-service.onrender.com/run-job';
    const maxAttempts = 3;
    const delayBetweenAttempts = 8 * 60 * 1000; // 8 minutes
  
    async function callWithRetry(attempt = 1) {
      try {
        const response = await fetch(endpoint, {
          redirect: 'manual', // Don't follow redirects
        });
  
        if (response.status === 302) {
          console.log(`Attempt ${attempt}: Got 302, job executed.`);
          return true;
        }
  
        if (response.ok) {
          console.log(`Attempt ${attempt}: Success.`);
          return true;
        }
  
        console.error(`Attempt ${attempt}: Failed with status ${response.status}`);
        return false;
      } catch (error) {
        console.error(`Attempt ${attempt}: Error`, error);
        return false;
      }
    }
  
    let success = await callWithRetry(1);
  
    if (!success) {
      console.log('Waiting 8 minutes for retry...');
      await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
      success = await callWithRetry(2);
    }
  
    if (!success) {
      console.log('Waiting another 8 minutes for final retry...');
      await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
      success = await callWithRetry(3);
    }
  
    if (success) {
      return res.status(200).send('Job triggered successfully.');
    } else {
      return res.status(500).send('Failed to trigger job after retries.');
    }
  }
  













// export default async function handler(req, res) {
//     // Optional: security check
//     if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
//       return res.status(401).end('Unauthorized');
//     }
  
//     // Call your Render endpoint
//     const response = await fetch('https://email-birthday-service.onrender.com/run-job');
  
//     if (response.ok) {
//       return res.status(200).send('Job triggered successfully.');
//     } else {
//       return res.status(500).send('Failed to trigger job.');
//     }
//   }
  
