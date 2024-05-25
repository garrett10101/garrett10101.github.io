const axios = require('axios');
const fs = require('fs');

// Replace with your access token
const accessToken = 'YOUR_ACCESS_TOKEN';

async function fetchLinkedInProfile() {
  try {
    const response = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    const profileData = response.data;

    // Save the data as a JSON file
    fs.writeFileSync('profileData.json', JSON.stringify(profileData, null, 2));
    console.log('Profile data saved as profileData.json');
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
  }
}

fetchLinkedInProfile();
