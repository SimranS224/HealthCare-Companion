async function main() {
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
    const fs = require('fs');
    var admin = require("firebase-admin");

    var serviceAccount = require("./healthcare-assitant-kxgfmk-firebase-adminsdk-3q8lq-047d0d801a");
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://healthcare-assitant-kxgfmk.firebaseio.com"
    });
    
    // Creates a client
    const client = new speech.SpeechClient();
  
 
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      uri: "gs://healthcare-assitant-kxgfmk.appspot.com/new_files/null/2020-01-19T02:37:34.439Z.wav",

    };
    const config = {
      sampleRateHertz: 48000,
      languageCode: 'en-US',
      audioChannelCount: 2,

    };
    const request = {
      audio: audio,
      config: config,
      
    };
  
    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results

      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  }
  main().catch(console.error);