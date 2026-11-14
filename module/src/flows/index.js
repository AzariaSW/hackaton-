export const registrationFlow = {
  key: 'registration',
  questions: [
    {
      key: 'name',
      type: 'text',
      autocomplete: 'name',
      required: true,
      validation: null,
      voiceInput: true
    },
    {
      key: 'phone',
      type: 'tel',
      autocomplete: 'tel',
      required: true,
      validation: 'ethiopian-phone',
      voiceInput: true
    },
    {
      key: 'identity',
      type: 'choice',
      required: true,
      options: [
        { value: 'national_id', icon: '🪪' },
        { value: 'refugee_id', icon: '📘' },
        { value: 'other', icon: '📄' },
        { value: 'partner_referral', icon: '🤝' }
      ]
    },
    {
      key: 'support',
      type: 'checkbox',
      required: false,
      sensitive: true,
      exclusiveOption: 'prefer_not_to_say',
      options: [
        { value: 'screen_reader', icon: '🔊' },
        { value: 'large_text', icon: '🔎' },
        { value: 'captions', icon: '💬' },
        { value: 'sign_language', icon: '🤟' },
        { value: 'interpreter_am', icon: '🗣️' },
        { value: 'more_time', icon: '⏳' },
        { value: 'prefer_not_to_say', icon: '🔒' }
      ]
    }
  ]
};

export const signinFlow = {
  key: 'signin',
  questions: [
    {
      key: 'method',
      type: 'choice',
      required: true,
      options: [
        { value: 'phone', icon: '📱' },
        { value: 'referral_code', icon: '🤝' }
      ]
    },
    {
      key: 'phone',
      type: 'tel',
      autocomplete: 'tel',
      required: true,
      validation: 'ethiopian-phone',
      voiceInput: true
    },
    {
      key: 'referralCode',
      type: 'text',
      required: false,
      validation: null,
      voiceInput: true
    }
  ]
};

export const profileEditFlow = {
  key: 'profile-edit',
  questions: [
    {
      key: 'name',
      type: 'text',
      autocomplete: 'name',
      required: false,
      validation: null,
      voiceInput: true
    },
    {
      key: 'phone',
      type: 'tel',
      autocomplete: 'tel',
      required: false,
      validation: 'ethiopian-phone',
      voiceInput: true
    }
  ]
};

export const jobApplyFlow = {
  key: 'job-apply',
  questions: [
    {
      key: 'experience',
      type: 'choice',
      required: true,
      options: [
        { value: '0-1', icon: '🌱' },
        { value: '1-3', icon: '🛠️' },
        { value: '3-5', icon: '💼' },
        { value: '5+', icon: '🏆' }
      ]
    },
    {
      key: 'education',
      type: 'choice',
      required: true,
      options: [
        { value: 'high_school', icon: '🏫' },
        { value: 'tvet_diploma', icon: '🔧' },
        { value: 'degree', icon: '🎓' },
        { value: 'masters', icon: '📚' }
      ]
    },
    {
      key: 'note',
      type: 'text',
      required: false,
      validation: null,
      voiceInput: true
    }
  ]
};

export const flows = {
  registration: registrationFlow,
  signin: signinFlow,
  'profile-edit': profileEditFlow,
  'job-apply': jobApplyFlow
};
