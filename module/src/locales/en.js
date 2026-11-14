export const en = {
  meta: {
    code: 'en',
    name: 'English',
    dir: 'ltr'
  },
  component: {
    loading: 'Loading onboarding form...',
    error: 'Something went wrong. Please refresh the page.',
    lowLiteracyToggle: 'Simple words & icons',
    voiceToggleOn: 'Voice: On',
    voiceToggleOff: 'Voice: Off',
    speedLabel: 'Speed',
    speedSlow: 'Slow',
    speedNormal: 'Normal',
    speedFast: 'Fast',
    listen: 'Listen',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    speakAnswer: 'Speak your answer',
    listening: 'Listening... speak now',
    heardPrefix: 'Heard:',
    readBack: 'Read back',
    recordVoiceNote: 'Record voice note',
    stopRecording: 'Stop recording',
    recordingActive: 'Recording voice note — tap Stop when finished',
    voiceNoteSaved: 'Voice note attached',
    playVoiceNote: 'Play voice note',
    unitKb: 'KB',
    voiceUnavailable: 'Speech recognition is unavailable on this browser. You can type or record a voice note.',
    noAmharicVoiceNotice: 'No Amharic voice is installed on this device. All screen text and controls remain active, or attach a voice note.',
    clearDraft: 'Start over',
    offlineBanner: 'You are offline. Answers are saved on this phone and will send when you are online.',
    pendingSync: 'Saved on this phone. It will send when you are online.',
    syncedSuccess: 'Saved answers were sent now that you are online.',
    consentLabel: 'I agree to share these registration details with the platform to create my profile.',
    assistBarTitle: 'How would you like to use this form? (Optional — updates immediately)',
    assistPresets: {
      readToMe: 'Read out loud to me',
      bigTextContrast: 'Bigger text & high contrast',
      simpleWords: 'Simple words & pictures',
      noSoundVisual: 'No sound (captions & visual)'
    }
  },
  navigation: {
    back: 'Back',
    continue: 'Continue',
    skip: 'Skip',
    submit: 'Submit'
  },
  progress: {
    question: 'Question {current} of {total}',
    step: 'Step {current} of {total}'
  },
  validation: {
    required: 'This field is required.',
    invalidPhone: 'Please enter a valid Ethiopian phone number (09..., 07..., or +251...).',
    invalidEmail: 'Please enter a valid email address.',
    consentRequired: 'Please check the box to confirm your consent before submitting.'
  },
  storage: {
    saved: 'Saved on this phone.',
    restored: 'We restored your previous answers from this phone.'
  },
  flows: {
    registration: {
      name: {
        label: 'What is your full name?',
        simpleLabel: 'Your name',
        description: 'Enter the name you want on your learning profile.',
        simpleDescription: 'Type or speak your first and last name.',
        placeholder: 'e.g. Abebe Bikila',
        voiceText: 'Question 1. What is your full name? You can type your name or press Speak your answer.'
      },
      phone: {
        label: 'What is your phone number?',
        simpleLabel: 'Phone number',
        description: 'Ethiopian mobile numbers starting with 09, 07, or +251 are accepted.',
        simpleDescription: 'Example: 0912345678 or 0712345678.',
        placeholder: '0912345678',
        voiceText: 'What is your phone number? Ethiopian numbers starting with 09, 07, or plus 251 are accepted.'
      },
      identity: {
        label: 'How would you like to verify your identity?',
        simpleLabel: 'Your ID option',
        description: 'If you do not have an ID document right now, choose partner referral. You can still finish registration.',
        simpleDescription: 'Pick an ID you have, or pick partner referral if you have no ID.',
        voiceText: 'How would you like to verify your identity? Choose National ID, Refugee ID, Other document, or No document to be referred through a partner.',
        options: {
          national_id: {
            label: 'National ID (Fayda / Kebele)',
            simpleLabel: 'National ID',
            description: 'Government-issued national or kebele identification'
          },
          refugee_id: {
            label: 'Refugee ID',
            simpleLabel: 'Refugee ID',
            description: 'UNHCR or RRS refugee agency document'
          },
          other: {
            label: 'Other document',
            simpleLabel: 'Other ID',
            description: 'Passport, student ID, or driver license'
          },
          partner_referral: {
            label: 'I have no document — refer me through a partner',
            simpleLabel: 'No ID — refer me to a partner',
            description: 'Complete registration now and connect with a local partner organization'
          }
        }
      },
      support: {
        label: 'What would make learning or working easier for you? (Optional)',
        simpleLabel: 'What helps you? (Optional)',
        description: 'Pick everyday needs in plain language. Your choices stay private and are never shared with employers.',
        simpleDescription: 'Pick what helps you. This is private. You can skip or pick Prefer not to say.',
        voiceText: 'Optional question. What would make learning or working easier for you? Choose reading out loud, bigger text, video captions, sign language, an interpreter, or extra time. Your choices stay private.',
        options: {
          screen_reader: {
            label: 'Read everything out loud (Screen reader support)',
            simpleLabel: 'Read text to me',
            description: 'Clear spoken labels and step announcements'
          },
          large_text: {
            label: 'Make text bigger and clearer (Large text & high contrast)',
            simpleLabel: 'Bigger, clearer text',
            description: 'Larger fonts and stronger color contrast'
          },
          captions: {
            label: 'Show written words on all videos (Captions)',
            simpleLabel: 'Words on videos',
            description: 'Text captions on learning media and calls'
          },
          sign_language: {
            label: 'Ethiopian Sign Language window or interpreter',
            simpleLabel: 'Sign language',
            description: 'Sign language video or interpreter'
          },
          interpreter_am: {
            label: 'Translate or explain in Amharic / local language',
            simpleLabel: 'Language interpreter',
            description: 'Language interpretation support'
          },
          more_time: {
            label: 'Give me extra time without countdown timers',
            simpleLabel: 'No rush / extra time',
            description: 'Unpaced deadlines and extended test time'
          },
          prefer_not_to_say: {
            label: 'Prefer not to say',
            simpleLabel: 'Prefer not to say',
            description: 'Continue without sharing support preferences'
          }
        }
      }
    },
    signin: {
      method: {
        label: 'How would you like to sign in?',
        simpleLabel: 'Pick how to sign in',
        description: 'Sign in with your phone number, or use your partner referral code.',
        simpleDescription: 'Choose phone number or referral code.',
        voiceText: 'How would you like to sign in? Choose phone number or partner referral code.',
        options: {
          phone: {
            label: 'Sign in with my phone number',
            simpleLabel: 'Use phone number',
            description: 'Use the 09..., 07..., or +251... number you registered with'
          },
          referral_code: {
            label: 'Sign in with a partner referral code',
            simpleLabel: 'Use referral code',
            description: 'Use the DB-REF code given at registration'
          }
        }
      },
      phone: {
        label: 'Enter your registered phone number',
        simpleLabel: 'Your phone number',
        description: 'Accepts 09..., 07..., or +251... formats.',
        simpleDescription: 'Example: 0912345678',
        placeholder: '0912345678',
        voiceText: 'Enter or speak your registered Ethiopian phone number.'
      },
      referralCode: {
        label: 'Enter your partner referral code (if using referral sign-in)',
        simpleLabel: 'Referral code (Optional)',
        description: 'Leave blank if signing in by phone number only.',
        simpleDescription: 'Example: DB-REF-1234ABCD',
        placeholder: 'DB-REF-XXXXXXXX',
        voiceText: 'Enter your partner referral code, or leave blank if signing in by phone number.'
      }
    },
    'profile-edit': {
      name: {
        label: 'Update your full name (leave blank to keep current)',
        simpleLabel: 'Change your name',
        description: 'Only fields you change will be updated.',
        simpleDescription: 'Leave empty if you do not want to change your name.',
        placeholder: 'Enter new full name',
        voiceText: 'Update your full name, or leave it blank to keep your current name.'
      },
      phone: {
        label: 'Update your phone number (leave blank to keep current)',
        simpleLabel: 'Change phone number',
        description: 'Accepts 09..., 07..., or +251... formats.',
        simpleDescription: 'Leave empty to keep your current number.',
        placeholder: '0912345678',
        voiceText: 'Update your phone number, or leave it blank to keep your current number.'
      }
    },
    'job-apply': {
      experience: {
        label: 'How many years of experience do you have?',
        simpleLabel: 'Work experience',
        description: 'Select the option that best matches your background.',
        simpleDescription: 'How long have you worked or practiced this skill?',
        voiceText: 'How many years of experience do you have?',
        options: {
          '0-1': { label: 'Less than 1 year', simpleLabel: 'Under 1 year', description: 'Starting out or recent graduate' },
          '1-3': { label: '1 to 3 years', simpleLabel: '1–3 years', description: 'Early career experience' },
          '3-5': { label: '3 to 5 years', simpleLabel: '3–5 years', description: 'Mid-level experience' },
          '5+': { label: 'More than 5 years', simpleLabel: '5+ years', description: 'Senior experience' }
        }
      },
      education: {
        label: 'What is your highest level of education?',
        simpleLabel: 'Education level',
        description: 'Formal or vocational training.',
        simpleDescription: 'Pick the highest school or training you finished.',
        voiceText: 'What is your highest level of education?',
        options: {
          high_school: { label: 'Secondary / High school', simpleLabel: 'High school', description: 'Completed secondary school' },
          tvet_diploma: { label: 'TVET / Diploma', simpleLabel: 'Diploma / TVET', description: 'Technical or vocational certificate' },
          degree: { label: 'Bachelor degree', simpleLabel: 'University degree', description: 'Undergraduate university degree' },
          masters: { label: 'Master degree or higher', simpleLabel: 'Master degree', description: 'Postgraduate education' }
        }
      },
      note: {
        label: 'Anything else to tell the employer? (Optional)',
        simpleLabel: 'Short message (Optional)',
        description: 'Private support preferences are NOT sent with this application.',
        simpleDescription: 'Write or speak a short note. Your private support choices stay hidden.',
        placeholder: 'Optional message about your skills or availability',
        voiceText: 'Optional. Anything else you want to tell the employer? Your private support preferences are not shared.'
      }
    }
  },
  completion: {
    title: 'Registration complete',
    signinTitle: 'Sign-in request ready',
    signinMessage: 'Your sign-in details have been passed to the host platform.',
    message: 'Your information has been passed to the platform.',
    referralTitle: 'Partner referral created',
    referralMessage: 'Your registration succeeded without an ID document. Show this referral code to a partner center to complete verification:',
    recordedAtLabel: 'Recorded:',
    nextSteps: 'You can safely close this page or continue to your dashboard.',
    restart: 'Start a new entry'
  }
};

export default en;
