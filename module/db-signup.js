/* Built single-file drop-in bundle — supports both <script defer> and <script type="module"> */
(function () {
  'use strict';
  var __scriptBase = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src)
    ? document.currentScript.src.replace(/\/[^/]*$/, '/')
    : '/module/';
  var __EMBEDDED_LOCALES = {
    en: {"meta":{"code":"en","name":"English","dir":"ltr"},"component":{"loading":"Loading onboarding form...","error":"Something went wrong. Please refresh the page.","lowLiteracyToggle":"Simple words & icons","voiceToggleOn":"Voice: On","voiceToggleOff":"Voice: Off","speedLabel":"Speed","speedSlow":"Slow","speedNormal":"Normal","speedFast":"Fast","listen":"Listen","pause":"Pause","resume":"Resume","stop":"Stop","speakAnswer":"Speak your answer","listening":"Listening... speak now","heardPrefix":"Heard:","readBack":"Read back","recordVoiceNote":"Record voice note","stopRecording":"Stop recording","recordingActive":"Recording voice note — tap Stop when finished","voiceNoteSaved":"Voice note attached","playVoiceNote":"Play voice note","unitKb":"KB","voiceUnavailable":"Speech recognition is unavailable on this browser. You can type or record a voice note.","noAmharicVoiceNotice":"No Amharic voice is installed on this device. All screen text and controls remain active, or attach a voice note.","clearDraft":"Start over","offlineBanner":"You are offline. Answers are saved on this phone and will send when you are online.","pendingSync":"Saved on this phone. It will send when you are online.","syncedSuccess":"Saved answers were sent now that you are online.","consentLabel":"I agree to share these registration details with the platform to create my profile.","assistBarTitle":"How would you like to use this form? (Optional — updates immediately)","assistPresets":{"readToMe":"Read out loud to me","bigTextContrast":"Bigger text & high contrast","simpleWords":"Simple words & pictures","noSoundVisual":"No sound (captions & visual)"}},"navigation":{"back":"Back","continue":"Continue","skip":"Skip","submit":"Submit"},"progress":{"question":"Question {current} of {total}","step":"Step {current} of {total}"},"validation":{"required":"This field is required.","invalidPhone":"Please enter a valid Ethiopian phone number (09..., 07..., or +251...).","invalidEmail":"Please enter a valid email address.","consentRequired":"Please check the box to confirm your consent before submitting."},"storage":{"saved":"Saved on this phone.","restored":"We restored your previous answers from this phone."},"flows":{"registration":{"name":{"label":"What is your full name?","simpleLabel":"Your name","description":"Enter the name you want on your learning profile.","simpleDescription":"Type or speak your first and last name.","placeholder":"e.g. Abebe Bikila","voiceText":"Question 1. What is your full name? You can type your name or press Speak your answer."},"phone":{"label":"What is your phone number?","simpleLabel":"Phone number","description":"Ethiopian mobile numbers starting with 09, 07, or +251 are accepted.","simpleDescription":"Example: 0912345678 or 0712345678.","placeholder":"0912345678","voiceText":"What is your phone number? Ethiopian numbers starting with 09, 07, or plus 251 are accepted."},"identity":{"label":"How would you like to verify your identity?","simpleLabel":"Your ID option","description":"If you do not have an ID document right now, choose partner referral. You can still finish registration.","simpleDescription":"Pick an ID you have, or pick partner referral if you have no ID.","voiceText":"How would you like to verify your identity? Choose National ID, Refugee ID, Other document, or No document to be referred through a partner.","options":{"national_id":{"label":"National ID (Fayda / Kebele)","simpleLabel":"National ID","description":"Government-issued national or kebele identification"},"refugee_id":{"label":"Refugee ID","simpleLabel":"Refugee ID","description":"UNHCR or RRS refugee agency document"},"other":{"label":"Other document","simpleLabel":"Other ID","description":"Passport, student ID, or driver license"},"partner_referral":{"label":"I have no document — refer me through a partner","simpleLabel":"No ID — refer me to a partner","description":"Complete registration now and connect with a local partner organization"}}},"support":{"label":"What would make learning or working easier for you? (Optional)","simpleLabel":"What helps you? (Optional)","description":"Pick everyday needs in plain language. Your choices stay private and are never shared with employers.","simpleDescription":"Pick what helps you. This is private. You can skip or pick Prefer not to say.","voiceText":"Optional question. What would make learning or working easier for you? Choose reading out loud, bigger text, video captions, sign language, an interpreter, or extra time. Your choices stay private.","options":{"screen_reader":{"label":"Read everything out loud (Screen reader support)","simpleLabel":"Read text to me","description":"Clear spoken labels and step announcements"},"large_text":{"label":"Make text bigger and clearer (Large text & high contrast)","simpleLabel":"Bigger, clearer text","description":"Larger fonts and stronger color contrast"},"captions":{"label":"Show written words on all videos (Captions)","simpleLabel":"Words on videos","description":"Text captions on learning media and calls"},"sign_language":{"label":"Ethiopian Sign Language window or interpreter","simpleLabel":"Sign language","description":"Sign language video or interpreter"},"interpreter_am":{"label":"Translate or explain in Amharic / local language","simpleLabel":"Language interpreter","description":"Language interpretation support"},"more_time":{"label":"Give me extra time without countdown timers","simpleLabel":"No rush / extra time","description":"Unpaced deadlines and extended test time"},"prefer_not_to_say":{"label":"Prefer not to say","simpleLabel":"Prefer not to say","description":"Continue without sharing support preferences"}}}},"signin":{"method":{"label":"How would you like to sign in?","simpleLabel":"Pick how to sign in","description":"Sign in with your phone number, or use your partner referral code.","simpleDescription":"Choose phone number or referral code.","voiceText":"How would you like to sign in? Choose phone number or partner referral code.","options":{"phone":{"label":"Sign in with my phone number","simpleLabel":"Use phone number","description":"Use the 09..., 07..., or +251... number you registered with"},"referral_code":{"label":"Sign in with a partner referral code","simpleLabel":"Use referral code","description":"Use the DB-REF code given at registration"}}},"phone":{"label":"Enter your registered phone number","simpleLabel":"Your phone number","description":"Accepts 09..., 07..., or +251... formats.","simpleDescription":"Example: 0912345678","placeholder":"0912345678","voiceText":"Enter or speak your registered Ethiopian phone number."},"referralCode":{"label":"Enter your partner referral code (if using referral sign-in)","simpleLabel":"Referral code (Optional)","description":"Leave blank if signing in by phone number only.","simpleDescription":"Example: DB-REF-1234ABCD","placeholder":"DB-REF-XXXXXXXX","voiceText":"Enter your partner referral code, or leave blank if signing in by phone number."}},"profile-edit":{"name":{"label":"Update your full name (leave blank to keep current)","simpleLabel":"Change your name","description":"Only fields you change will be updated.","simpleDescription":"Leave empty if you do not want to change your name.","placeholder":"Enter new full name","voiceText":"Update your full name, or leave it blank to keep your current name."},"phone":{"label":"Update your phone number (leave blank to keep current)","simpleLabel":"Change phone number","description":"Accepts 09..., 07..., or +251... formats.","simpleDescription":"Leave empty to keep your current number.","placeholder":"0912345678","voiceText":"Update your phone number, or leave it blank to keep your current number."}},"job-apply":{"experience":{"label":"How many years of experience do you have?","simpleLabel":"Work experience","description":"Select the option that best matches your background.","simpleDescription":"How long have you worked or practiced this skill?","voiceText":"How many years of experience do you have?","options":{"0-1":{"label":"Less than 1 year","simpleLabel":"Under 1 year","description":"Starting out or recent graduate"},"1-3":{"label":"1 to 3 years","simpleLabel":"1–3 years","description":"Early career experience"},"3-5":{"label":"3 to 5 years","simpleLabel":"3–5 years","description":"Mid-level experience"},"5+":{"label":"More than 5 years","simpleLabel":"5+ years","description":"Senior experience"}}},"education":{"label":"What is your highest level of education?","simpleLabel":"Education level","description":"Formal or vocational training.","simpleDescription":"Pick the highest school or training you finished.","voiceText":"What is your highest level of education?","options":{"high_school":{"label":"Secondary / High school","simpleLabel":"High school","description":"Completed secondary school"},"tvet_diploma":{"label":"TVET / Diploma","simpleLabel":"Diploma / TVET","description":"Technical or vocational certificate"},"degree":{"label":"Bachelor degree","simpleLabel":"University degree","description":"Undergraduate university degree"},"masters":{"label":"Master degree or higher","simpleLabel":"Master degree","description":"Postgraduate education"}}},"note":{"label":"Anything else to tell the employer? (Optional)","simpleLabel":"Short message (Optional)","description":"Private support preferences are NOT sent with this application.","simpleDescription":"Write or speak a short note. Your private support choices stay hidden.","placeholder":"Optional message about your skills or availability","voiceText":"Optional. Anything else you want to tell the employer? Your private support preferences are not shared."}}},"completion":{"title":"Registration complete","signinTitle":"Sign-in request ready","signinMessage":"Your sign-in details have been passed to the host platform.","message":"Your information has been passed to the platform.","referralTitle":"Partner referral created","referralMessage":"Your registration succeeded without an ID document. Show this referral code to a partner center to complete verification:","recordedAtLabel":"Recorded:","nextSteps":"You can safely close this page or continue to your dashboard.","restart":"Start a new entry"}},
    am: {"meta":{"code":"am","name":"አማርኛ","dir":"ltr"},"component":{"loading":"የምዝገባ ቅጹን በመጫን ላይ...","error":"ስህተት ተፈጥሯል። እባክዎ ገጹን ያድሱ።","lowLiteracyToggle":"ቀላል ቃላት እና ምስሎች","voiceToggleOn":"ድምፅ፡ በርቷል","voiceToggleOff":"ድምፅ፡ ጠፍቷል","speedLabel":"ፍጥነት","speedSlow":"ቀስ ያለ","speedNormal":"መደበኛ","speedFast":"ፈጣን","listen":"አዳምጥ","pause":"አቁም","resume":"ቀጥል","stop":"ዝጋ","speakAnswer":"መልስዎን ይናገሩ","listening":"በማዳመጥ ላይ... አሁን ይናገሩ","heardPrefix":"የተሰማው፡","readBack":"መልሰህ አንብብ","recordVoiceNote":"የድምፅ መልእክት ይቅረጹ","stopRecording":"መቅረጽ አቁም","recordingActive":"ድምፅ በመቅረጽ ላይ — ሲጨርሱ አቁም የሚለውን ይጫኑ","voiceNoteSaved":"የድምፅ መልእክት ተያይዟል","playVoiceNote":"የድምፅ መልእክቱን አጫውት","unitKb":"ኪ.ባ","voiceUnavailable":"በዚህ መሣሪያ ላይ ንግግር ወደ ጽሁፍ አይሰራም። መጻፍ ወይም የድምፅ መልእክት መቅረጽ ይችላሉ።","noAmharicVoiceNotice":"በዚህ ስልክ ላይ የአማርኛ ንግግር ድምፅ አልተጫነም። ሁሉም ጽሁፎች ይሰራሉ፤ ወይም የድምፅ መልእክት መቅረጽ ይችላሉ።","clearDraft":"እንደገና ጀምር","offlineBanner":"ኢንተርኔት የለም። መልሶችዎ በዚህ ስልክ ላይ ተቀምጠዋል፤ ኢንተርኔት ሲመጣ ይላካሉ።","pendingSync":"በዚህ ስልክ ላይ ተቀምጧል። ኢንተርኔት ሲኖር ይላካል።","syncedSuccess":"ኢንተርኔት ስለተገኘ የተቀመጡ መልሶችዎ ተልከዋል።","consentLabel":"መገለጫዬን ለመፍጠር እነዚህን የምዝገባ መረጃዎች ለመድረኩ ለማጋራት እስማማለሁ።","assistBarTitle":"ይህንን ቅጽ እንዴት መጠቀም ይፈልጋሉ? (አማራጭ — ወዲያውኑ ይቀየራል)","assistPresets":{"readToMe":"በድምፅ አንብብልኝ","bigTextContrast":"ትልቅ ጽሁፍ እና ከፍተኛ ንጽጽር","simpleWords":"ቀላል ቃላት እና ምስሎች","noSoundVisual":"ድምፅ አያስፈልግም (በጽሁፍ እና ምስል)"}},"navigation":{"back":"ተመለስ","continue":"ቀጥል","skip":"ዝለል","submit":"አስገባ"},"progress":{"question":"ጥያቄ {current} ከ {total}","step":"እርምጃ {current} ከ {total}"},"validation":{"required":"ይህ መረጃ ያስፈልጋል።","invalidPhone":"እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (09...፣ 07... ወይም +251...)።","invalidEmail":"እባክዎ ትክክለኛ ኢሜይል አድራሻ ያስገቡ።","consentRequired":"ከማስገባትዎ በፊት እባክዎ ፈቃድዎን ለማረጋገጥ ሳጥኑን ይምረጡ።"},"storage":{"saved":"በዚህ ስልክ ላይ ተቀምጧል።","restored":"ከዚህ ቀደም የሞሉትን መልሶች ከስልክዎ ላይ መልሰናል።"},"flows":{"registration":{"name":{"label":"ሙሉ ስምዎ ማን ነው?","simpleLabel":"ስምዎ","description":"በመማሪያ መገለጫዎ ላይ እንዲታይ የሚፈልጉትን ስም ያስገቡ።","simpleDescription":"የእርስዎን እና የአባትዎን ስም ይጻፉ ወይም ይናገሩ።","placeholder":"ለምሳሌ፡ አበበ ቢቂላ","voiceText":"ጥያቄ 1። ሙሉ ስምዎ ማን ነው? ስምዎን መጻፍ ወይም መልስዎን ይናገሩ የሚለውን መጫን ይችላሉ።"},"phone":{"label":"ስልክ ቁጥርዎ ስንት ነው?","simpleLabel":"ስልክ ቁጥር","description":"በ 09፣ በ 07 ወይም በ +251 የሚጀምሩ የኢትዮጵያ ስልክ ቁጥሮች ይቀበላሉ።","simpleDescription":"ምሳሌ፡ 0912345678 ወይም 0712345678።","placeholder":"0912345678","voiceText":"ስልክ ቁጥርዎ ስንት ነው? በ 09፣ በ 07 ወይም በ +251 የሚጀምሩ ቁጥሮችን ያስገቡ።"},"identity":{"label":"ማንነትዎን እንዴት ማረጋገጥ ይፈልጋሉ?","simpleLabel":"የመታወቂያ አማራጭ","description":"አሁን መታወቂያ ከሌለዎት በአጋር ድርጅት በኩል የሚለውን ይምረጡ። ምዝገባውን በተሳካ ሁኔታ መጨረስ ይችላሉ።","simpleDescription":"ያለዎትን መታወቂያ ይምረጡ ወይም ከሌለዎት የአጋር ድጋፍን ይምረጡ።","voiceText":"ማንነትዎን እንዴት ማረጋገጥ ይፈልጋሉ? ብሔራዊ መታወቂያ፣ የስደተኛ መታወቂያ፣ ሌላ ሰነድ፣ ወይም ሰነድ የለኝም በአጋር ድርጅት ይላኩኝ የሚለውን ይምረጡ።","options":{"national_id":{"label":"ብሔራዊ መታወቂያ (ፋይዳ / ቀበሌ)","simpleLabel":"ብሔራዊ መታወቂያ","description":"በመንግስት የተሰጠ ብሔራዊ ወይም የቀበሌ መታወቂያ"},"refugee_id":{"label":"የስደተኛ መታወቂያ","simpleLabel":"የስደተኛ መታወቂያ","description":"የዩኤንኤችሲአር ወይም የስደተኞች ኤጀንሲ ሰነድ"},"other":{"label":"ሌላ ሰነድ","simpleLabel":"ሌላ መታወቂያ","description":"ፓስፖርት፣ የተማሪ መታወቂያ ወይም መንጃ ፈቃድ"},"partner_referral":{"label":"ሰነድ የለኝም — በአጋር ድርጅት በኩል ይላኩኝ","simpleLabel":"መታወቂያ የለኝም — አጋር ያገናኙኝ","description":"አሁን ምዝገባውን ጨርሰው ከአካባቢው አጋር ድርጅት ጋር ይገናኙ"}}},"support":{"label":"መማር ወይም መሥራት ቀላል እንዲሆንልዎ ምን ይረዳዎታል? (አማራጭ)","simpleLabel":"ምን ይረዳዎታል? (አማራጭ)","description":"በቀላል ቋንቋ የሚያስፈልግዎትን ይምረጡ። ምርጫዎ በሚስጥር ይያዛል፤ ለአሰሪዎች በፍጹም አይጋራም።","simpleDescription":"የሚረዳዎትን ይምረጡ። ይህ በሚስጥር ይያዛል።","voiceText":"አማራጭ ጥያቄ። መማር ወይም መሥራት ቀላል እንዲሆንልዎ ምን ይረዳዎታል? በድምፅ ማንበብ፣ ትልቅ ጽሁፍ፣ የቪዲዮ ጽሁፍ፣ የምልክት ቋንቋ፣ አስተርጓሚ ወይም ተጨማሪ ጊዜ መምረጥ ይችላሉ።","options":{"screen_reader":{"label":"ሁሉንም ነገር በድምፅ አንብብልኝ (ስክሪን አንባቢ)","simpleLabel":"ጽሁፉን አንብብልኝ","description":"ግልጽ የድምፅ መሪ እና የእርምጃ ማሳወቂያ"},"large_text":{"label":"ጽሁፉን ተለቅ እና ግልጽ አድርግልኝ (ትልቅ ጽሁፍ)","simpleLabel":"ትልቅ እና ግልጽ ጽሁፍ","description":"ትልቅ ፊደላት እና ጠንካራ የቀለም ንጽጽር"},"captions":{"label":"በቪዲዮዎች ላይ የጽሁፍ መግለጫ አሳየኝ (Captions)","simpleLabel":"በቪዲዮ ላይ ጽሁፍ","description":"በትምህርት ቪዲዮዎች ላይ የጽሁፍ መግለጫ"},"sign_language":{"label":"የኢትዮጵያ የምልክት ቋንቋ መስኮት ወይም አስተርጓሚ","simpleLabel":"የምልክት ቋንቋ","description":"የምልክት ቋንቋ ቪዲዮ ወይም አስተርጓሚ"},"interpreter_am":{"label":"በአማርኛ / በአካባቢ ቋንቋ አስተርጓሚ","simpleLabel":"የቋንቋ አስተርጓሚ","description":"የቋንቋ ትርጉም ድጋፍ"},"more_time":{"label":"ያለ ጊዜ ገደብ ተጨማሪ ጊዜ ስጠኝ","simpleLabel":"ተጨማሪ ጊዜ / ያለ ችኮላ","description":"ያለ ጊዜ ገደብ እና ተጨማሪ የፈተና ጊዜ"},"prefer_not_to_say":{"label":"መናገር አልፈልግም","simpleLabel":"መናገር አልፈልግም","description":"የድጋፍ ምርጫ ሳያጋሩ ይቀጥሉ"}}}},"signin":{"method":{"label":"እንዴት መግባት ይፈልጋሉ?","simpleLabel":"መግቢያ መንገድ ይምረጡ","description":"በስልክ ቁጥርዎ ወይም በአጋር ሪፈራል ኮድዎ ይግቡ።","simpleDescription":"ስልክ ቁጥር ወይም ሪፈራል ኮድ ይምረጡ።","voiceText":"እንዴት መግባት ይፈልጋሉ? በስልክ ቁጥር ወይም በአጋር ሪፈራል ኮድ መግባት ይችላሉ።","options":{"phone":{"label":"በስልክ ቁጥሬ መግባት እፈልጋለሁ","simpleLabel":"በስልክ ቁጥር ግባ","description":"የተመዘገቡበትን 09...፣ 07... ወይም +251... ቁጥር ይጠቀሙ"},"referral_code":{"label":"በአጋር ሪፈራል ኮድ መግባት እፈልጋለሁ","simpleLabel":"በሪፈራል ኮድ ግባ","description":"ሲመዘገቡ የተሰጠዎትን DB-REF ኮድ ይጠቀሙ"}}},"phone":{"label":"የተመዘገቡበትን ስልክ ቁጥር ያስገቡ","simpleLabel":"ስልክ ቁጥርዎ","description":"09...፣ 07... ወይም +251... ይቀበላል።","simpleDescription":"ምሳሌ፡ 0912345678","placeholder":"0912345678","voiceText":"የተመዘገቡበትን የኢትዮጵያ ስልክ ቁጥር ያስገቡ ወይም ይናገሩ።"},"referralCode":{"label":"የአጋር ሪፈራል ኮድዎን ያስገቡ (በሪፈራል የሚገቡ ከሆነ)","simpleLabel":"ሪፈራል ኮድ (አማራጭ)","description":"በስልክ ቁጥር ብቻ የሚገቡ ከሆነ ባዶ ይተዉት።","simpleDescription":"ምሳሌ፡ DB-REF-1234ABCD","placeholder":"DB-REF-XXXXXXXX","voiceText":"የአጋር ሪፈራል ኮድዎን ያስገቡ ወይም በስልክ ቁጥር የሚገቡ ከሆነ ባዶ ይተዉት።"}},"profile-edit":{"name":{"label":"ሙሉ ስምዎን ያድሱ (ያለውን ለማቆየት ባዶ ይተዉት)","simpleLabel":"ስምዎን ይቀይሩ","description":"የቀየሩት መረጃ ብቻ ይታደሳል።","simpleDescription":"ስምዎን መቀየር ካልፈለጉ ባዶ ይተዉት።","placeholder":"አዲስ ሙሉ ስም ያስገቡ","voiceText":"ሙሉ ስምዎን ያድሱ ወይም ያለውን ለማቆየት ባዶ ይተዉት።"},"phone":{"label":"ስልክ ቁጥርዎን ያድሱ (ያለውን ለማቆየት ባዶ ይተዉት)","simpleLabel":"ስልክ ቁጥር ይቀይሩ","description":"09...፣ 07... ወይም +251... ይቀበላል።","simpleDescription":"ያለውን ቁጥር ለማቆየት ባዶ ይተዉት።","placeholder":"0912345678","voiceText":"ስልክ ቁጥርዎን ያድሱ ወይም ያለውን ለማቆየት ባዶ ይተዉት።"}},"job-apply":{"experience":{"label":"ስንት ዓመት የስራ ልምድ አለዎት?","simpleLabel":"የስራ ልምድ","description":"ከልምድዎ ጋር የሚስማማውን ይምረጡ።","simpleDescription":"ለምን ያህል ጊዜ ሰርተዋል?","voiceText":"ስንት ዓመት የስራ ልምድ አለዎት?","options":{"0-1":{"label":"ከ 1 ዓመት በታች","simpleLabel":"ከ 1 ዓመት በታች","description":"አዲስ ጀማሪ ወይም ተመራቂ"},"1-3":{"label":"ከ 1 እስከ 3 ዓመት","simpleLabel":"1–3 ዓመት","description":"የመጀመሪያ ደረጃ ልምድ"},"3-5":{"label":"ከ 3 እስከ 5 ዓመት","simpleLabel":"3–5 ዓመት","description":"መካከለኛ ደረጃ ልምድ"},"5+":{"label":"ከ 5 ዓመት በላይ","simpleLabel":"5+ ዓመት","description":"ከፍተኛ ልምድ"}}},"education":{"label":"ከፍተኛው የትምህርት ደረጃዎ ምንድነው?","simpleLabel":"የትምህርት ደረጃ","description":"መደበኛ ወይም የሙያ ስልጠና።","simpleDescription":"የጨረሱትን ከፍተኛ ትምህርት ይምረጡ።","voiceText":"ከፍተኛው የትምህርት ደረጃዎ ምንድነው?","options":{"high_school":{"label":"ሁለተኛ ደረጃ ትምህርት","simpleLabel":"ሁለተኛ ደረጃ","description":"የሁለተኛ ደረጃ ትምህርት ያጠናቀቀ"},"tvet_diploma":{"label":"ቴክኒክና ሙያ / ዲፕሎማ","simpleLabel":"ዲፕሎማ / ቴክኒክ","description":"የቴክኒክ ወይም የሙያ ሰርተፊኬት"},"degree":{"label":"የመጀመሪያ ዲግሪ","simpleLabel":"የዩኒቨርሲቲ ዲግሪ","description":"የመጀመሪያ የዩኒቨርሲቲ ዲግሪ"},"masters":{"label":"ማስተርስ ዲግሪ ወይም ከዚያ በላይ","simpleLabel":"ማስተርስ ዲግሪ","description":"የድህረ ምረቃ ትምህርት"}}},"note":{"label":"ለአሰሪው ተጨማሪ መልእክት አለዎት? (አማራጭ)","simpleLabel":"አጭር መልእክት (አማራጭ)","description":"የግል የተደራሽነት ድጋፍ ምርጫዎችዎ ለአሰሪው አይላኩም።","simpleDescription":"አጭር ማስታወሻ ይጻፉ ወይም ይናገሩ። የግል ድጋፍ ምርጫዎ አይጋራም።","placeholder":"ስለ ክህሎትዎ ወይም ዝግጁነትዎ አማራጭ መልእክት","voiceText":"አማራጭ። ለአሰሪው የሚነግሩት ተጨማሪ ነገር አለ? የግል ድጋፍ ምርጫዎችዎ አይጋሩም።"}}},"completion":{"title":"ምዝገባው ተጠናቋል","signinTitle":"የመግቢያ ጥያቄ ተዘጋጅቷል","signinMessage":"የመግቢያ መረጃዎ ወደ መድረኩ ተላልፏል።","message":"መረጃዎ ለመድረኩ በተሳካ ሁኔታ ተላልፏል።","referralTitle":"የአጋር ሪፈራል ተፈጥሯል","referralMessage":"ያለ መታወቂያ ሰነድ ምዝገባዎ ተሳክቷል። ማረጋገጫውን ለመጨረስ ይህንን ኮድ ለአጋር ማዕከል ያሳዩ፡","recordedAtLabel":"የተመዘገበበት ቀን፡","nextSteps":"ይህን ገጽ በደህና መዝጋት ወይም ወደ መነሻ ገጽዎ መቀጠል ይችላሉ።","restart":"አዲስ ምዝገባ ጀምር"}}
  };

  // --- module/src/utils/phone.js ---
const SPOKEN_DIGIT_MAP = {
  // English
  zero: '0', oh: '0', o: '0',
  one: '1', two: '2', three: '3', four: '4', five: '5',
  six: '6', seven: '7', eight: '8', nine: '9', plus: '+',
  // Amharic transliterations & Fidel number words
  'ዜሮ': '0', 'ባዶ': '0',
  'አንድ': '1', 'ሁለት': '2', 'ሶስት': '3', 'ሦስት': '3',
  'አራት': '4', 'አምስት': '5', 'ስድስት': '6', 'ሰባት': '7',
  'ስምንት': '8', 'ዘጠኝ': '9'
};function convertSpokenDigits(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return '';
  const tokens = raw.toLowerCase().split(/\s+/);
  let converted = '';
  let matchedWord = false;
  for (const token of tokens) {
    if (Object.prototype.hasOwnProperty.call(SPOKEN_DIGIT_MAP, token)) {
      converted += SPOKEN_DIGIT_MAP[token];
      matchedWord = true;
    } else if (/^[+0-9]+$/.test(token)) {
      converted += token;
    } else {
      return raw;
    }
  }
  return matchedWord ? converted : raw;
}function cleanPhoneInput(value) {
  return String(value ?? '').replace(/[\s()-]/g, '').trim();
}function isValidEthiopianPhone(value) {
  const cleaned = cleanPhoneInput(value);
  return /^(\+251|251|0)(9|7)[0-9]{8}$/.test(cleaned);
}function normalizeEthiopianPhone(value) {
  const cleaned = cleanPhoneInput(value);
  if (!isValidEthiopianPhone(cleaned)) {
    return null;
  }
  if (cleaned.startsWith('+251')) {
    return cleaned;
  }
  if (cleaned.startsWith('251')) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0')) {
    return `+251${cleaned.slice(1)}`;
  }
  return `+251${cleaned}`;
}

  // --- module/src/flows/index.js ---
const registrationFlow = {
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
};const signinFlow = {
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
};const profileEditFlow = {
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
};const jobApplyFlow = {
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
};const flows = {
  registration: registrationFlow,
  signin: signinFlow,
  'profile-edit': profileEditFlow,
  'job-apply': jobApplyFlow
};

  // --- module/src/utils/storage.js ---
class StorageManager {
  constructor(prefix = 'db-signup') {
    this.prefix = prefix;
    this.dbName = `${prefix}-draft-store`;
    this.dbVersion = 2;
    this.db = null;
    this.memoryFallback = new Map();
  }

  async init() {
    if (typeof indexedDB === 'undefined') {
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = () => {
          resolve(null);
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('drafts')) {
            const store = db.createObjectStore('drafts', { keyPath: 'id' });
            store.createIndex('flow', 'flow', { unique: false });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
          }
          if (!db.objectStoreNames.contains('pending')) {
            db.createObjectStore('pending', { keyPath: 'submissionId' });
          }
          if (!db.objectStoreNames.contains('support')) {
            db.createObjectStore('support', { keyPath: 'id' });
          }
        };
      } catch {
        resolve(null);
      }
    });
  }

  async save(flow, currentStep, answers) {
    if (!this.db) await this.init();

    const record = {
      id: `draft_${flow}`,
      flow,
      currentStep,
      answers,
      updatedAt: new Date().toISOString()
    };

    if (!this.db) {
      this.memoryFallback.set(record.id, record);
      return record;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['drafts'], 'readwrite');
      const store = tx.objectStore('drafts');
      const request = store.put(record);
      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  }

  async load(flow) {
    if (!this.db) await this.init();

    if (!this.db) {
      return this.memoryFallback.get(`draft_${flow}`) || null;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(['drafts'], 'readonly');
      const store = tx.objectStore('drafts');
      const direct = store.get(`draft_${flow}`);
      direct.onsuccess = () => {
        if (direct.result) {
          resolve(direct.result);
          return;
        }
        const index = store.index('flow');
        const allReq = index.getAll(flow);
        allReq.onsuccess = () => {
          const results = allReq.result || [];
          if (results.length === 0) {
            resolve(null);
            return;
          }
          results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          resolve(results[0]);
        };
        allReq.onerror = () => resolve(null);
      };
      direct.onerror = () => resolve(null);
    });
  }

  async clear(flow) {
    if (!this.db) await this.init();
    this.memoryFallback.delete(`draft_${flow}`);

    if (!this.db) return;

    return new Promise((resolve) => {
      const tx = this.db.transaction(['drafts'], 'readwrite');
      const store = tx.objectStore('drafts');
      const index = store.index('flow');
      const request = index.openCursor(flow);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => resolve();
    });
  }

  async saveSupportPreferences(preferences) {
    if (!this.db) await this.init();
    const record = {
      id: 'current',
      support: Array.isArray(preferences) ? preferences : [],
      updatedAt: new Date().toISOString()
    };

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('db-signup:support-local', JSON.stringify(record.support));
      }
    } catch {
      // Ignore storage quota errors
    }

    if (!this.db) {
      this.memoryFallback.set('support_current', record);
      return record;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(['support'], 'readwrite');
      const store = tx.objectStore('support');
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => resolve(record);
    });
  }

  async queuePendingSubmission(payload) {
    if (!this.db) await this.init();

    if (!this.db) {
      this.memoryFallback.set(`pending_${payload.submissionId}`, payload);
      return payload;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(['pending'], 'readwrite');
      const store = tx.objectStore('pending');
      const req = store.put(payload);
      req.onsuccess = () => resolve(payload);
      req.onerror = () => resolve(payload);
    });
  }

  async getPendingSubmissions() {
    if (!this.db) await this.init();

    if (!this.db) {
      return [...this.memoryFallback.entries()]
        .filter(([k]) => k.startsWith('pending_'))
        .map(([, v]) => v);
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(['pending'], 'readonly');
      const store = tx.objectStore('pending');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async removePendingSubmission(submissionId) {
    if (!this.db) await this.init();
    this.memoryFallback.delete(`pending_${submissionId}`);

    if (!this.db) return;

    return new Promise((resolve) => {
      const tx = this.db.transaction(['pending'], 'readwrite');
      const store = tx.objectStore('pending');
      const req = store.delete(submissionId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  }

  saveUiPrefs(prefs) {
    const clean = {
      lowLiteracy: Boolean(prefs?.lowLiteracy),
      bigTextContrast: Boolean(prefs?.bigTextContrast),
      noSoundVisual: Boolean(prefs?.noSoundVisual),
      voiceRate: Number(prefs?.voiceRate) || 0.95
    };
    this.memoryFallback.set('ui_prefs', clean);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`${this.prefix}:ui-prefs`, JSON.stringify(clean));
      }
    } catch {
      // Ignore storage quota errors
    }
    return clean;
  }

  loadUiPrefs() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(`${this.prefix}:ui-prefs`);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      // Ignore parse/storage errors
    }
    return this.memoryFallback.get('ui_prefs') || null;
  }
}const storage = new StorageManager();

  // --- module/src/utils/voice.js ---
class VoiceManager {
  constructor(locale = 'en', audioBase = null) {
    this.locale = locale;
    this.audioBase = audioBase ? audioBase.replace(/\/+$/, '') : null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.currentAudio = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.enabled = true;
    this.rate = 0.95;
    this.recognition = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.voices = [];
    this._highlightTimer = null;
  }

  async init() {
    if (this.synth) {
      await this.loadVoices();
    } else {
      this.enabled = Boolean(this.audioBase);
    }
    this.initSpeechRecognition();
  }

  async loadVoices() {
    if (!this.synth) return;
    this.voices = await new Promise((resolve) => {
      const voices = this.synth.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }
      const timer = setTimeout(() => resolve(this.synth.getVoices()), 250);
      this.synth.onvoiceschanged = () => {
        clearTimeout(timer);
        resolve(this.synth.getVoices());
      };
    });
  }

  /**
   * Returns an exact language match only. Never uses an English voice to read Amharic.
   */
  getExactVoiceForLocale(lang = this.locale) {
    if (!this.voices || this.voices.length === 0) return null;
    const prefix = lang === 'am' ? 'am' : 'en';
    const matches = this.voices.filter((v) => v.lang?.toLowerCase().startsWith(prefix));
    if (matches.length === 0) return null;
    // Prefer local/natural voices when available
    return matches.find((v) => v.localService) || matches[0];
  }

  hasNativeVoiceForLocale(lang = this.locale) {
    return Boolean(this.getExactVoiceForLocale(lang));
  }

  hasSpeechRecognition() {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  hasVoiceNoteSupport() {
    return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined');
  }

  setRate(rate) {
    this.rate = Math.max(0.7, Math.min(1.4, Number(rate) || 0.95));
  }

  /**
   * 3-tier playback:
   * 1) Pre-recorded audio clip if audioBase + clipKey is configured and reachable
   * 2) Native speechSynthesis ONLY if a matching language voice is installed
   * 3) Graceful silent completion (never reads Amharic with an English voice)
   */
  async speak(text, { clipKey = null, onWord, onEnd, onNoNativeVoice, rate = this.rate, pitch = 1.0 } = {}) {
    if (!this.enabled || !text) {
      onEnd?.();
      return;
    }

    this.stop();

    if (this.audioBase && clipKey && typeof Audio !== 'undefined') {
      const played = await this._tryAudioClip(`${this.audioBase}/${this.locale}/${clipKey}.mp3`, text, { onWord, onEnd, rate });
      if (played) return;
    }

    const voice = this.getExactVoiceForLocale(this.locale);
    if (!this.synth || !voice) {
      onNoNativeVoice?.(this.locale);
      onEnd?.();
      return;
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = this.locale === 'am' ? 'am-ET' : 'en-US';

      let gotNativeBoundary = false;
      const words = text.split(/\s+/).filter(Boolean);
      let fallbackIdx = 0;

      const clearTimers = () => {
        if (this._highlightTimer) {
          clearInterval(this._highlightTimer);
          this._highlightTimer = null;
        }
      };

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.isPaused = false;
        this.currentUtterance = utterance;
        onWord?.(0, words[0] || '');

        const msPerWord = Math.round(400 / Math.max(0.7, rate));
        this._highlightTimer = setInterval(() => {
          if (gotNativeBoundary || this.isPaused) return;
          fallbackIdx += 1;
          if (fallbackIdx < words.length) {
            onWord?.(fallbackIdx, words[fallbackIdx]);
          } else {
            clearTimers();
          }
        }, msPerWord);
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word' || typeof event.charIndex === 'number') {
          gotNativeBoundary = true;
          clearTimers();
          const prefix = text.slice(0, event.charIndex).trim();
          const idx = prefix ? prefix.split(/\s+/).length : 0;
          onWord?.(idx, words[idx] || '');
        }
      };

      const finish = () => {
        clearTimers();
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentUtterance = null;
        onEnd?.();
        resolve();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      this.synth.speak(utterance);
    });
  }

  _tryAudioClip(url, text, { onWord, onEnd, rate }) {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.playbackRate = rate;
      const words = text.split(/\s+/).filter(Boolean);
      let idx = 0;

      const cleanup = () => {
        if (this._highlightTimer) {
          clearInterval(this._highlightTimer);
          this._highlightTimer = null;
        }
        this.currentAudio = null;
        this.isSpeaking = false;
      };

      audio.oncanplaythrough = () => {
        this.currentAudio = audio;
        this.isSpeaking = true;
        onWord?.(0, words[0] || '');
        const stepMs = audio.duration && words.length
          ? Math.max(180, Math.round((audio.duration * 1000) / words.length / rate))
          : 400;
        this._highlightTimer = setInterval(() => {
          idx += 1;
          if (idx < words.length) onWord?.(idx, words[idx]);
        }, stepMs);
        audio.play().catch(() => {
          cleanup();
          resolve(false);
        });
      };

      audio.onended = () => {
        cleanup();
        onEnd?.();
        resolve(true);
      };

      audio.onerror = () => {
        cleanup();
        resolve(false);
      };
    });
  }

  pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isPaused = true;
      return;
    }
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.currentAudio && this.isPaused) {
      this.currentAudio.play().catch(() => {});
      this.isPaused = false;
      return;
    }
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  stop() {
    if (this._highlightTimer) {
      clearInterval(this._highlightTimer);
      this._highlightTimer = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stop();
    }
    return this.enabled;
  }

  initSpeechRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 3;
  }

  startListening(locale = 'en-US') {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not available'));
        return;
      }

      this.recognition.lang = locale;
      this.recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        resolve(transcript);
      };
      this.recognition.onerror = (event) => reject(new Error(event.error || 'recognition_error'));
      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore if not active
      }
    }
  }

  async startVoiceNote() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    const donePromise = new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        const previewUrl = typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(blob) : null;
        resolve({
          mimeType: blob.type || 'audio/webm',
          sizeBytes: blob.size,
          recordedAt: new Date().toISOString(),
          previewUrl
        });
      };
    });

    this.mediaRecorder.start();
    return donePromise;
  }

  stopVoiceNote() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
}

  // --- module/src/utils/stepper.js ---
class StepEngine {
  constructor({ questions = [], locale = {}, flowKey = 'registration', language = 'en' } = {}) {
    this.questions = questions;
    this.locale = locale;
    this.flowKey = flowKey;
    this.language = language;
    this.currentIndex = 0;
    this.answers = {};
    this.voiceNotes = [];
  }

  get currentStep() {
    return this.questions[this.currentIndex];
  }

  get isFirst() {
    return this.currentIndex === 0;
  }

  get isLast() {
    return this.currentIndex === this.questions.length - 1;
  }

  get progress() {
    return {
      current: this.currentIndex + 1,
      total: this.questions.length
    };
  }

  setAnswer(value, key = this.currentStep?.key) {
    if (!key) return;
    this.answers[key] = {
      value,
      timestamp: new Date().toISOString()
    };
  }

  getAnswer(key) {
    return this.answers[key]?.value;
  }

  addVoiceNote(fieldKey, metadata) {
    this.voiceNotes = this.voiceNotes.filter((n) => n.fieldKey !== fieldKey);
    const { previewUrl: _preview, ...serializable } = metadata || {};
    this.voiceNotes.push({ fieldKey, ...serializable });
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }

  validate(step = this.currentStep) {
    if (!step) return { valid: true };
    const answer = this.getAnswer(step.key);
    const messages = this.locale?.validation || {
      required: 'This field is required.',
      invalidPhone: 'Please enter a valid Ethiopian phone number.'
    };

    const isEmpty =
      answer === undefined ||
      answer === null ||
      (typeof answer === 'string' && answer.trim() === '') ||
      (Array.isArray(answer) && answer.length === 0);

    const isRequired =
      step.required ||
      (this.flowKey === 'signin' && step.key === 'referralCode' && this.getAnswer('method') === 'referral_code');

    if (isRequired && isEmpty) {
      return { valid: false, error: messages.required };
    }

    if (!isEmpty && step.validation === 'ethiopian-phone') {
      if (!isValidEthiopianPhone(answer)) {
        return { valid: false, error: messages.invalidPhone };
      }
    }

    return { valid: true };
  }

  /**
   * Builds privacy-separated submission payloads per SRS FR-SUP-03 & Track 1 data contract.
   * Support choices are NEVER placed inside profile/done payload.
   */
  buildSubmissionPayloads(submissionId, { consentAccepted = true } = {}) {
    if (this.flowKey === 'signin') {
      const phoneRaw = this.getAnswer('phone');
      const phone = normalizeEthiopianPhone(phoneRaw) || phoneRaw || '';
      const method = this.getAnswer('method') || 'phone';
      const referralCode = (this.getAnswer('referralCode') || '').trim() || null;
      return {
        isSignin: true,
        signinDetail: {
          submissionId,
          method,
          phone,
          referralCode,
          language: this.language,
          requestedAt: new Date().toISOString()
        },
        doneDetail: null,
        supportDetail: { support: [], preferNotToSay: false }
      };
    }

    const profile = { language: this.language };
    let supportChoices = [];
    let preferNotToSay = false;

    for (const q of this.questions) {
      const raw = this.getAnswer(q.key);
      if (q.sensitive || q.key === 'support') {
        const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
        if (list.includes('prefer_not_to_say')) {
          preferNotToSay = true;
          supportChoices = [];
        } else {
          supportChoices = list;
        }
        continue;
      }

      if (raw === undefined || raw === null || (typeof raw === 'string' && raw.trim() === '')) {
        continue;
      }

      if (q.key === 'identity') {
        profile.idRoute = raw;
      } else if (q.key === 'phone') {
        profile.phone = normalizeEthiopianPhone(raw) || raw;
      } else {
        profile[q.key] = typeof raw === 'string' ? raw.trim() : raw;
      }
    }

    const completedAt = new Date().toISOString();
    const referralCode =
      profile.idRoute === 'partner_referral'
        ? `DB-REF-${submissionId.slice(0, 8).toUpperCase()}`
        : null;

    return {
      isSignin: false,
      doneDetail: {
        submissionId,
        flow: this.flowKey,
        profile,
        referralCode,
        voiceNotes: this.voiceNotes,
        consent: {
          accepted: Boolean(consentAccepted),
          recordedAt: completedAt
        },
        completedAt
      },
      supportDetail: {
        support: supportChoices,
        preferNotToSay
      }
    };
  }
}

  // --- module/src/component.js ---
function createSubmissionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}class DbSignupComponent {
  constructor(hostElement) {
    this.host = hostElement;
    this.shadow = hostElement.shadowRoot || hostElement.attachShadow({ mode: 'open' });
    this.storage = new StorageManager();
    this.voice = new VoiceManager();
    this.locale = {};
    this.lang = 'en';
    this.mode = 'registration';
    this.api = null;
    this.theme = 'default';
    this.audioBase = null;
    this.lowLiteracy = false;
    this.bigTextContrast = false;
    this.noSoundVisual = false;
    this.engine = null;
    this.isRecording = false;
    this.isListeningStt = false;
    this.activeSubmissionId = createSubmissionId();
    this.initialized = false;
    this._onlineHandler = () => this.handleConnectivityChange();
  }

  async mount() {
    const rawLang = (this.host.getAttribute('lang') || 'en').trim().toLowerCase();
    this.lang = /^[a-z]{2,3}(-[a-z]{2,4})?$/.test(rawLang) ? rawLang : 'en';
    this.mode = this.host.getAttribute('mode') || 'registration';
    this.api = this.host.getAttribute('api') || null;
    this.theme = this.host.getAttribute('theme') || 'default';
    this.audioBase = this.host.getAttribute('audio-base') || null;

    await this.loadLocale(this.lang);
    await this.storage.init();
    this.voice.audioBase = this.audioBase ? this.audioBase.replace(/\/+$/, '') : null;
    await this.voice.init();
    this.voice.locale = this.lang;

    const savedPrefs = this.storage.loadUiPrefs();
    if (savedPrefs) {
      this.lowLiteracy = Boolean(savedPrefs.lowLiteracy);
      this.bigTextContrast = Boolean(savedPrefs.bigTextContrast);
      this.noSoundVisual = Boolean(savedPrefs.noSoundVisual);
      this.voice.enabled = !this.noSoundVisual;
      if (savedPrefs.voiceRate) {
        this.voice.setRate(savedPrefs.voiceRate);
      }
    }

    const flow = flows[this.mode] || flows.registration;
    this.engine = new StepEngine({
      questions: flow.questions,
      locale: this.locale,
      flowKey: flow.key,
      language: this.lang
    });

    const savedDraft = await this.storage.load(flow.key);
    let restored = false;
    if (savedDraft && savedDraft.answers) {
      this.engine.answers = savedDraft.answers;
      const idx = Number(savedDraft.currentStep) || 0;
      this.engine.currentIndex = Math.max(0, Math.min(idx, flow.questions.length - 1));
      restored = Object.keys(savedDraft.answers).length > 0;
    }

    this.renderShell();
    if (restored) {
      this.showNotice(this.locale.storage.restored);
    }
    this.renderStep({ moveFocus: false, speakStep: false });
    this.handleConnectivityChange();

    if (!this.initialized && typeof window !== 'undefined') {
      window.addEventListener('online', this._onlineHandler);
      window.addEventListener('offline', this._onlineHandler);
      this.initialized = true;
    }
  }

  destroy() {
    this.voice.stop();
    this.voice.stopListening();
    if (this.isRecording) {
      this.voice.stopVoiceNote();
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this._onlineHandler);
      window.removeEventListener('offline', this._onlineHandler);
    }
  }

  async onAttributeChange(name, oldValue, newValue) {
    if (oldValue === newValue || !this.initialized) return;
    if (name === 'lang' || name === 'mode' || name === 'api' || name === 'theme' || name === 'audio-base') {
      this.voice.stop();
      await this.mount();
    }
  }

  async loadLocale(lang) {
    const safeLang = /^[a-z]{2,3}(-[a-z]{2,4})?$/.test(lang) ? lang.toLowerCase() : 'en';
    const shortLang = safeLang.split('-')[0];
    const customBase = this.host.getAttribute('locales-base');

    for (const candidate of [safeLang, shortLang]) {
      if (!customBase && __EMBEDDED_LOCALES[candidate]) {
        this.locale = __EMBEDDED_LOCALES[candidate];
        return;
      }
      if (typeof fetch === 'function') {
        try {
          const base = (customBase || (__scriptBase + 'src/locales')).replace(/\/+$/, '');
          const res = await fetch(base + '/' + candidate + '.json');
          if (res.ok) {
            this.locale = await res.json();
            return;
          }
        } catch {
          // Continue fallback chain
        }
      }
      if (__EMBEDDED_LOCALES[candidate]) {
        this.locale = __EMBEDDED_LOCALES[candidate];
        return;
      }
    }

    this.locale = __EMBEDDED_LOCALES.en;
  }

  renderShell() {
    const dir = this.locale.meta?.dir || (this.lang.startsWith('ar') ? 'rtl' : 'ltr');
    const isAm = this.lang.startsWith('am');

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--bs-body-font-family, 'Noto Sans Ethiopic', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
          color: var(--bs-body-color, #1a1a1a);
          line-height: ${isAm ? '1.7' : '1.5'};
          max-width: 42rem;
          margin: 0 auto;
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .card {
          background: #ffffff;
          border: 1px solid #d0d7de;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
        }

        .card.assist-big-contrast {
          border: 3px solid #000000;
          font-size: 1.18rem;
          color: #000000;
        }

        .card.assist-big-contrast .question-title {
          font-size: 1.65rem;
          color: #000000;
        }

        .card.assist-big-contrast .question-description,
        .card.assist-big-contrast .choice-desc,
        .card.assist-big-contrast .progress {
          color: #111827;
        }

        .card.assist-big-contrast input[type="text"],
        .card.assist-big-contrast input[type="tel"],
        .card.assist-big-contrast .choice-label-row {
          border-color: #000000;
          border-width: 2.5px;
        }

        @media (max-width: 30rem) {
          .card {
            padding: 1rem;
          }
        }

        .assist-bar {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.75rem;
          margin-bottom: 0.9rem;
        }

        .assist-bar-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .assist-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .toolbar-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          align-items: center;
        }

        .speed-select {
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          min-height: 2.75rem;
          padding: 0.35rem 0.6rem;
          border-radius: 0.5rem;
          border: 2px solid #6b7280;
          background: #ffffff;
          color: #111827;
        }

        .progress {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 0.75rem;
        }

        .banner {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.9375rem;
          border-inline-start: 4px solid #0f766e;
          background: #f0fdfa;
          color: #134e4a;
        }

        .banner-offline {
          border-inline-start-color: #b45309;
          background: #fffbeb;
          color: #78350f;
        }

        .question-title {
          font-size: 1.375rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #111827;
          line-height: ${isAm ? '1.7' : '1.35'};
        }

        .question-title:focus {
          outline: 3px solid #f5a300;
          outline-offset: 4px;
          border-radius: 0.25rem;
        }

        .question-description {
          font-size: 1rem;
          color: #4b5563;
          margin: 0 0 1rem 0;
        }

        .word-highlight {
          background: #fde047;
          color: #111827;
          border-radius: 0.2rem;
          padding: 0 0.15rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        label.field-label {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        input[type="text"],
        input[type="tel"],
        input[type="email"] {
          width: 100%;
          min-height: 2.75rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-family: inherit;
          color: #111827;
          background: #ffffff;
          border: 2px solid #6b7280;
          border-radius: 0.5rem;
        }

        input.error {
          border-color: #b00020;
        }

        fieldset {
          border: 0;
          padding: 0;
          margin: 0;
        }

        legend.sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
        }

        .choices {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .choice-label-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          min-height: 2.75rem;
          border: 2px solid #6b7280;
          border-radius: 0.5rem;
          cursor: pointer;
          background: #ffffff;
        }

        .choice-label-row:hover {
          border-color: var(--bs-primary, #0052a3);
          background: #f0f7ff;
        }

        .choice-label-row.selected {
          border-color: var(--bs-primary, #0052a3);
          background: #e6f0ff;
        }

        .choice-input {
          width: 1.375rem;
          height: 1.375rem;
          min-width: 1.375rem;
          margin-top: 0.15rem;
          accent-color: var(--bs-primary, #0052a3);
          cursor: pointer;
        }

        .choice-icon {
          font-size: 1.35rem;
          line-height: 1;
          margin-inline-end: 0.25rem;
        }

        .choice-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .choice-title {
          font-weight: 600;
          font-size: 1rem;
          color: #111827;
        }

        .choice-desc {
          font-size: 0.9375rem;
          color: #4b5563;
        }

        .voice-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .error-message {
          color: #b00020;
          font-size: 0.9375rem;
          font-weight: 600;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .status-note {
          font-size: 0.9375rem;
          color: #1e3a8a;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          margin-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .recording-bar {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          padding: 0.65rem 0.85rem;
          margin-top: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        button {
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          min-height: 2.75rem;
          min-width: 2.75rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: 2px solid transparent;
          cursor: pointer;
        }

        button:focus-visible,
        select:focus-visible,
        input:focus-visible,
        [tabindex]:focus-visible {
          outline: 3px solid #f5a300;
          outline-offset: 2px;
        }

        .btn-primary {
          background: var(--bs-primary, #0052a3);
          color: #ffffff;
          flex: 1 1 10rem;
        }

        .btn-primary:hover {
          filter: brightness(0.92);
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #111827;
          border-color: #4b5563;
        }

        .consent-row {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.85rem 1rem;
          min-height: 2.75rem;
          border: 2px solid #6b7280;
          border-radius: 0.5rem;
          background: #f8fafc;
          margin-top: 1rem;
          cursor: pointer;
        }

        .consent-row input {
          width: 1.35rem;
          height: 1.35rem;
          min-width: 1.35rem;
          margin-top: 0.1rem;
          accent-color: var(--bs-primary, #0052a3);
        }

        .btn-outline {
          background: #ffffff;
          color: #111827;
          border-color: #6b7280;
          font-size: 0.9rem;
        }

        .btn-outline[aria-pressed="true"] {
          background: #e6f0ff;
          border-color: var(--bs-primary, #0052a3);
          color: #003366;
        }

        .btn-danger {
          background: #b00020;
          color: #ffffff;
        }

        .referral-box {
          background: #f0fdf4;
          border: 2px solid #15803d;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
        }

        .referral-code {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #14532d;
          margin-top: 0.5rem;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            animation: none !important;
          }
        }
      </style>

      <div id="card-root" class="card" dir="${dir}" lang="${this.lang}">
        <section class="assist-bar" aria-label="${this.locale.component.assistBarTitle}">
          <p class="assist-bar-title">${this.locale.component.assistBarTitle}</p>
          <div class="assist-chips">
            <button type="button" id="preset-read" class="btn-outline" aria-pressed="true"></button>
            <button type="button" id="preset-big" class="btn-outline" aria-pressed="false"></button>
            <button type="button" id="preset-simple" class="btn-outline" aria-pressed="false"></button>
            <button type="button" id="preset-nosound" class="btn-outline" aria-pressed="false"></button>
          </div>
        </section>

        <div class="toolbar">
          <div class="toolbar-group">
            <button type="button" id="btn-listen" class="btn-outline"></button>
            <button type="button" id="btn-voice-toggle" class="btn-outline" aria-pressed="true"></button>
            <label for="voice-speed" class="sr-only">${this.locale.component.speedLabel}</label>
            <select id="voice-speed" class="speed-select" aria-label="${this.locale.component.speedLabel}">
              <option value="0.8">${this.locale.component.speedSlow} (0.8x)</option>
              <option value="0.95" selected>${this.locale.component.speedNormal} (1.0x)</option>
              <option value="1.2">${this.locale.component.speedFast} (1.2x)</option>
            </select>
          </div>
          <div class="toolbar-group">
            <button type="button" id="btn-clear-draft" class="btn-outline"></button>
          </div>
        </div>

        <div id="offline-banner" class="banner banner-offline" style="display: none;" role="status"></div>
        <div id="notice-banner" class="banner" style="display: none;" role="status"></div>

        <form id="step-form" lang="${this.lang}" novalidate>
          <div class="progress" id="progress"></div>
          <div id="question-container"></div>
          <div class="button-group" id="button-group"></div>
        </form>
      </div>

      <div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
    `;

    this.updateToolbarLabels();
    this.bindToolbarEvents();
  }

  toggleSupportOption(value, enabled) {
    const stepHasSupport = this.engine.questions.some((q) => q.key === 'support');
    if (!stepHasSupport) return;
    const current = Array.isArray(this.engine.getAnswer('support'))
      ? [...this.engine.getAnswer('support')].filter((v) => v !== 'prefer_not_to_say')
      : [];
    const next = enabled
      ? [...new Set([...current, value])]
      : current.filter((v) => v !== value);
    this.engine.setAnswer(next, 'support');
    this.saveDraft();
  }

  updateToolbarLabels() {
    const t = this.locale.component;
    const cardRoot = this.shadow.getElementById('card-root');
    if (cardRoot) {
      cardRoot.classList.toggle('assist-big-contrast', this.bigTextContrast);
    }

    const listenBtn = this.shadow.getElementById('btn-listen');
    const voiceToggleBtn = this.shadow.getElementById('btn-voice-toggle');
    const clearBtn = this.shadow.getElementById('btn-clear-draft');
    const presetRead = this.shadow.getElementById('preset-read');
    const presetBig = this.shadow.getElementById('preset-big');
    const presetSimple = this.shadow.getElementById('preset-simple');
    const presetNoSound = this.shadow.getElementById('preset-nosound');

    const speedSelect = this.shadow.getElementById('voice-speed');
    if (speedSelect) {
      speedSelect.value = String(this.voice.rate);
    }

    if (listenBtn) listenBtn.textContent = `🔊 ${this.voice.isSpeaking ? t.stop : t.listen}`;
    if (voiceToggleBtn) {
      voiceToggleBtn.textContent = this.voice.enabled ? t.voiceToggleOn : t.voiceToggleOff;
      voiceToggleBtn.setAttribute('aria-pressed', String(this.voice.enabled));
    }
    if (clearBtn) clearBtn.textContent = t.clearDraft;

    if (presetRead) {
      presetRead.textContent = `🔊 ${t.assistPresets.readToMe}`;
      presetRead.setAttribute('aria-pressed', String(this.voice.enabled && !this.noSoundVisual));
    }
    if (presetBig) {
      presetBig.textContent = `🔎 ${t.assistPresets.bigTextContrast}`;
      presetBig.setAttribute('aria-pressed', String(this.bigTextContrast));
    }
    if (presetSimple) {
      presetSimple.textContent = `✨ ${t.assistPresets.simpleWords}`;
      presetSimple.setAttribute('aria-pressed', String(this.lowLiteracy));
    }
    if (presetNoSound) {
      presetNoSound.textContent = `💬 ${t.assistPresets.noSoundVisual}`;
      presetNoSound.setAttribute('aria-pressed', String(this.noSoundVisual));
    }
  }

  persistUiPrefs() {
    this.storage.saveUiPrefs({
      lowLiteracy: this.lowLiteracy,
      bigTextContrast: this.bigTextContrast,
      noSoundVisual: this.noSoundVisual,
      voiceRate: this.voice.rate
    });
  }

  bindToolbarEvents() {
    this.shadow.getElementById('preset-read')?.addEventListener('click', () => {
      this.noSoundVisual = false;
      this.voice.enabled = true;
      this.toggleSupportOption('screen_reader', true);
      this.persistUiPrefs();
      this.updateToolbarLabels();
      this.speakCurrentQuestion();
    });

    this.shadow.getElementById('preset-big')?.addEventListener('click', () => {
      this.bigTextContrast = !this.bigTextContrast;
      this.toggleSupportOption('large_text', this.bigTextContrast);
      this.persistUiPrefs();
      this.updateToolbarLabels();
      if (this.engine.currentStep?.key === 'support') {
        this.renderStep({ moveFocus: false, speakStep: false });
      }
    });

    this.shadow.getElementById('preset-simple')?.addEventListener('click', () => {
      this.lowLiteracy = !this.lowLiteracy;
      this.persistUiPrefs();
      this.updateToolbarLabels();
      this.renderStep({ moveFocus: false, speakStep: false });
    });

    this.shadow.getElementById('preset-nosound')?.addEventListener('click', () => {
      this.noSoundVisual = !this.noSoundVisual;
      if (this.noSoundVisual) {
        this.voice.enabled = false;
        this.voice.stop();
        this.clearWordHighlight();
        this.toggleSupportOption('captions', true);
        this.toggleSupportOption('sign_language', true);
      } else {
        this.voice.enabled = true;
      }
      this.persistUiPrefs();
      this.updateToolbarLabels();
      if (this.engine.currentStep?.key === 'support') {
        this.renderStep({ moveFocus: false, speakStep: false });
      }
    });

    this.shadow.getElementById('btn-listen')?.addEventListener('click', () => {
      if (this.voice.isSpeaking) {
        this.voice.stop();
        this.clearWordHighlight();
        this.updateToolbarLabels();
      } else {
        this.speakCurrentQuestion();
      }
    });

    this.shadow.getElementById('btn-voice-toggle')?.addEventListener('click', () => {
      this.voice.toggle();
      this.noSoundVisual = !this.voice.enabled;
      this.persistUiPrefs();
      this.clearWordHighlight();
      this.updateToolbarLabels();
      this.announce(this.voice.enabled ? this.locale.component.voiceToggleOn : this.locale.component.voiceToggleOff);
    });

    this.shadow.getElementById('voice-speed')?.addEventListener('change', (e) => {
      this.voice.setRate(e.target.value);
      this.persistUiPrefs();
      if (this.voice.isSpeaking) {
        this.speakCurrentQuestion();
      }
    });

    this.shadow.getElementById('btn-clear-draft')?.addEventListener('click', async () => {
      this.voice.stop();
      await this.storage.clear(this.engine.flowKey);
      this.engine.answers = {};
      this.engine.voiceNotes = [];
      this.engine.currentIndex = 0;
      this.activeSubmissionId = createSubmissionId();
      this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
    });

    this.shadow.getElementById('step-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContinue();
    });
  }

  getStepCopy(step) {
    const flowTexts = this.locale.flows?.[this.engine.flowKey]?.[step.key] || {};
    const label = this.lowLiteracy && flowTexts.simpleLabel ? flowTexts.simpleLabel : (flowTexts.label || step.key);
    const description = this.lowLiteracy && flowTexts.simpleDescription
      ? flowTexts.simpleDescription
      : (flowTexts.description || '');
    const placeholder = flowTexts.placeholder || '';
    const voiceText = flowTexts.voiceText || label;
    return { label, description, placeholder, voiceText, optionsMap: flowTexts.options || {} };
  }

  renderStep({ moveFocus = true, speakStep = true } = {}) {
    const step = this.engine.currentStep;
    const progress = this.engine.progress;
    const copy = this.getStepCopy(step);

    const progressEl = this.shadow.getElementById('progress');
    const questionContainer = this.shadow.getElementById('question-container');
    const buttonGroup = this.shadow.getElementById('button-group');

    const progressText = this.locale.progress.question
      .replace('{current}', progress.current)
      .replace('{total}', progress.total);
    progressEl.textContent = progressText;

    questionContainer.innerHTML = '';
    buttonGroup.innerHTML = '';

    const heading = document.createElement('h2');
    heading.className = 'question-title';
    heading.id = 'question-title';
    heading.setAttribute('tabindex', '-1');
    this.renderHighlightableText(heading, copy.label);
    questionContainer.appendChild(heading);

    if (copy.description) {
      const desc = document.createElement('p');
      desc.className = 'question-description';
      desc.id = `desc-${step.key}`;
      desc.textContent = copy.description;
      questionContainer.appendChild(desc);
    }

    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    const errorDiv = document.createElement('p');
    errorDiv.id = `error-${step.key}`;
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.style.display = 'none';

    if (step.type === 'choice' || step.type === 'checkbox') {
      const fieldset = document.createElement('fieldset');
      const describedBy = [copy.description ? `desc-${step.key}` : '', errorDiv.id].filter(Boolean).join(' ');
      if (describedBy) fieldset.setAttribute('aria-describedby', describedBy);
      const legend = document.createElement('legend');
      legend.className = 'sr-only';
      legend.textContent = copy.label;
      fieldset.appendChild(legend);

      const choicesDiv = document.createElement('div');
      choicesDiv.className = 'choices';
      const inputType = step.type === 'checkbox' ? 'checkbox' : 'radio';
      const saved = this.engine.getAnswer(step.key);
      const selectedSet = new Set(Array.isArray(saved) ? saved : saved ? [saved] : []);

      step.options.forEach((option, idx) => {
        const optCopy = copy.optionsMap[option.value] || {};
        const optLabel = this.lowLiteracy && optCopy.simpleLabel ? optCopy.simpleLabel : (optCopy.label || option.value);
        const optDesc = optCopy.description || '';

        const rowLabel = document.createElement('label');
        rowLabel.className = 'choice-label-row';
        const inputId = `field-${step.key}-${idx}`;
        rowLabel.htmlFor = inputId;

        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        input.name = step.key;
        input.value = option.value;
        input.className = 'choice-input';
        input.checked = selectedSet.has(option.value);
        if (input.checked) rowLabel.classList.add('selected');

        input.addEventListener('change', () => {
          if (inputType === 'radio') {
            this.engine.setAnswer(option.value);
            choicesDiv.querySelectorAll('.choice-label-row').forEach((r) => r.classList.remove('selected'));
            rowLabel.classList.add('selected');
          } else {
            const currentArr = Array.isArray(this.engine.getAnswer(step.key))
              ? [...this.engine.getAnswer(step.key)]
              : [];
            let nextArr;
            if (input.checked) {
              if (step.exclusiveOption && option.value === step.exclusiveOption) {
                nextArr = [option.value];
              } else {
                nextArr = currentArr.filter((v) => v !== step.exclusiveOption);
                if (!nextArr.includes(option.value)) nextArr.push(option.value);
              }
            } else {
              nextArr = currentArr.filter((v) => v !== option.value);
            }
            this.engine.setAnswer(nextArr);
            choicesDiv.querySelectorAll('input').forEach((el) => {
              el.checked = nextArr.includes(el.value);
              el.closest('.choice-label-row')?.classList.toggle('selected', el.checked);
            });
          }
          this.saveDraft();
        });

        rowLabel.appendChild(input);

        if (this.lowLiteracy && option.icon) {
          const iconSpan = document.createElement('span');
          iconSpan.className = 'choice-icon';
          iconSpan.setAttribute('aria-hidden', 'true');
          iconSpan.textContent = option.icon;
          rowLabel.appendChild(iconSpan);
        }

        const textWrap = document.createElement('span');
        textWrap.className = 'choice-text';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'choice-title';
        titleSpan.textContent = optLabel;
        textWrap.appendChild(titleSpan);

        if (optDesc) {
          const descSpan = document.createElement('span');
          descSpan.className = 'choice-desc';
          descSpan.textContent = optDesc;
          textWrap.appendChild(descSpan);
        }

        rowLabel.appendChild(textWrap);
        choicesDiv.appendChild(rowLabel);
      });

      fieldset.appendChild(choicesDiv);
      formGroup.appendChild(fieldset);
    } else {
      const label = document.createElement('label');
      label.className = 'field-label';
      label.htmlFor = `field-${step.key}`;
      label.textContent = copy.label;
      formGroup.appendChild(label);

      const input = document.createElement('input');
      input.type = step.type || 'text';
      input.id = `field-${step.key}`;
      input.name = step.key;
      if (step.autocomplete) input.autocomplete = step.autocomplete;
      input.placeholder = copy.placeholder;
      if (step.required) input.required = true;

      const describedBy = [copy.description ? `desc-${step.key}` : '', errorDiv.id].filter(Boolean).join(' ');
      if (describedBy) input.setAttribute('aria-describedby', describedBy);

      const saved = this.engine.getAnswer(step.key);
      if (saved !== undefined && saved !== null) {
        input.value = String(saved);
      }

      input.addEventListener('input', (e) => {
        input.removeAttribute('aria-invalid');
        input.classList.remove('error');
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        this.engine.setAnswer(e.target.value);
        this.saveDraft();
      });

      formGroup.appendChild(input);

      if (step.voiceInput) {
        this.renderVoiceInputControls(formGroup, step, input);
      }
    }

    formGroup.appendChild(errorDiv);

    if (this.engine.flowKey === 'registration' && this.engine.isLast) {
      const consentWrap = document.createElement('div');
      const consentErr = document.createElement('p');
      consentErr.id = 'error-consent';
      consentErr.className = 'error-message';
      consentErr.setAttribute('role', 'alert');
      consentErr.style.display = 'none';

      const consentLabel = document.createElement('label');
      consentLabel.className = 'consent-row';
      consentLabel.htmlFor = 'consent-check';

      const consentInput = document.createElement('input');
      consentInput.type = 'checkbox';
      consentInput.id = 'consent-check';
      consentInput.required = true;
      consentInput.setAttribute('aria-describedby', 'error-consent');
      consentInput.checked = Boolean(this.engine.getAnswer('_consent'));
      consentInput.addEventListener('change', () => {
        this.engine.setAnswer(consentInput.checked, '_consent');
        consentInput.removeAttribute('aria-invalid');
        consentErr.style.display = 'none';
        consentErr.textContent = '';
        this.saveDraft();
      });

      const consentText = document.createElement('span');
      consentText.textContent = this.locale.component.consentLabel;

      consentLabel.appendChild(consentInput);
      consentLabel.appendChild(consentText);
      consentWrap.appendChild(consentLabel);
      consentWrap.appendChild(consentErr);
      formGroup.appendChild(consentWrap);
    }

    questionContainer.appendChild(formGroup);

    if (!this.engine.isFirst) {
      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'btn-secondary';
      backBtn.textContent = this.locale.navigation.back;
      backBtn.addEventListener('click', () => {
        this.voice.stop();
        this.engine.previous();
        this.saveDraft();
        this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
      });
      buttonGroup.appendChild(backBtn);
    }

    const continueBtn = document.createElement('button');
    continueBtn.type = 'submit';
    continueBtn.className = 'btn-primary';
    continueBtn.textContent = this.engine.isLast
      ? this.locale.navigation.submit
      : this.locale.navigation.continue;
    buttonGroup.appendChild(continueBtn);

    this.dispatchStepEvent();
    this.announce(`${progressText}. ${copy.label}`);

    if (moveFocus) {
      setTimeout(() => heading.focus(), 30);
    }

    if (speakStep && this.voice.enabled) {
      this.speakCurrentQuestion();
    }
  }

  renderHighlightableText(containerEl, text) {
    containerEl.innerHTML = '';
    const words = String(text).split(/(\s+)/);
    let wordCounter = 0;
    for (const token of words) {
      if (/^\s+$/.test(token)) {
        containerEl.appendChild(document.createTextNode(token));
      } else if (token.length > 0) {
        const span = document.createElement('span');
        span.dataset.wordIdx = String(wordCounter);
        span.textContent = token;
        containerEl.appendChild(span);
        wordCounter += 1;
      }
    }
  }

  clearWordHighlight() {
    this.shadow.querySelectorAll('.word-highlight').forEach((el) => {
      el.classList.remove('word-highlight');
    });
  }

  speakCurrentQuestion() {
    const step = this.engine.currentStep;
    if (!step) return;
    const copy = this.getStepCopy(step);
    const titleWordsCount = copy.label.split(/\s+/).filter(Boolean).length;

    this.voice.speak(copy.voiceText, {
      clipKey: `${this.engine.flowKey}_${step.key}`,
      onWord: (idx) => {
        this.clearWordHighlight();
        const targetIdx = Math.min(idx, Math.max(0, titleWordsCount - 1));
        const span = this.shadow.querySelector(`#question-title [data-word-idx="${targetIdx}"]`);
        if (span) span.classList.add('word-highlight');
      },
      onNoNativeVoice: (lang) => {
        if (lang === 'am') {
          this.showNotice(this.locale.component.noAmharicVoiceNotice);
        }
      },
      onEnd: () => {
        this.clearWordHighlight();
        this.updateToolbarLabels();
      }
    });
    this.updateToolbarLabels();
  }

  renderVoiceInputControls(formGroup, step, input) {
    const t = this.locale.component;
    const controls = document.createElement('div');
    controls.className = 'voice-actions';

    const statusNote = document.createElement('div');
    statusNote.className = 'status-note';
    statusNote.style.display = 'none';
    statusNote.setAttribute('aria-live', 'polite');

    const statusText = document.createElement('span');
    const noteActionWrap = document.createElement('span');
    noteActionWrap.style.display = 'inline-flex';
    noteActionWrap.style.gap = '0.4rem';

    const readBackBtn = document.createElement('button');
    readBackBtn.type = 'button';
    readBackBtn.className = 'btn-outline';
    readBackBtn.textContent = `🔊 ${t.readBack}`;
    readBackBtn.style.display = 'none';
    readBackBtn.addEventListener('click', () => {
      if (input.value.trim()) {
        this.voice.speak(input.value.trim());
      }
    });

    const playNoteBtn = document.createElement('button');
    playNoteBtn.type = 'button';
    playNoteBtn.className = 'btn-outline';
    playNoteBtn.textContent = `▶ ${t.playVoiceNote}`;
    playNoteBtn.style.display = 'none';
    let currentPreviewUrl = null;
    let previewAudio = null;
    playNoteBtn.addEventListener('click', () => {
      if (!currentPreviewUrl || typeof Audio === 'undefined') return;
      if (previewAudio) {
        previewAudio.pause();
        previewAudio = null;
      }
      previewAudio = new Audio(currentPreviewUrl);
      previewAudio.play().catch(() => {});
    });

    noteActionWrap.appendChild(readBackBtn);
    noteActionWrap.appendChild(playNoteBtn);
    statusNote.appendChild(statusText);
    statusNote.appendChild(noteActionWrap);

    const speakBtn = document.createElement('button');
    speakBtn.type = 'button';
    speakBtn.className = 'btn-outline';
    speakBtn.textContent = `🎤 ${t.speakAnswer}`;
    speakBtn.addEventListener('click', async () => {
      if (!this.voice.hasSpeechRecognition()) {
        statusText.textContent = t.voiceUnavailable;
        readBackBtn.style.display = 'none';
        statusNote.style.display = 'flex';
        return;
      }

      try {
        this.voice.stop();
        this.isListeningStt = true;
        speakBtn.disabled = true;
        statusText.textContent = t.listening;
        readBackBtn.style.display = 'none';
        statusNote.style.display = 'flex';

        const sttLang = this.lang === 'am' ? 'am-ET' : 'en-US';
        const rawTranscript = await this.voice.startListening(sttLang);
        const transcript = step.type === 'tel' ? convertSpokenDigits(rawTranscript) : rawTranscript;

        input.value = transcript;
        this.engine.setAnswer(transcript);
        await this.saveDraft();
        statusText.textContent = `${t.heardPrefix} "${transcript}"`;
        playNoteBtn.style.display = 'none';
        readBackBtn.style.display = transcript ? 'inline-flex' : 'none';
        this.announce(`${t.heardPrefix} ${transcript}`);
        if (this.voice.enabled && transcript) {
          this.voice.speak(`${t.heardPrefix} ${transcript}`);
        }
      } catch {
        statusText.textContent = t.voiceUnavailable;
        readBackBtn.style.display = 'none';
        playNoteBtn.style.display = 'none';
        statusNote.style.display = 'flex';
      } finally {
        this.isListeningStt = false;
        speakBtn.disabled = false;
      }
    });
    controls.appendChild(speakBtn);

    if (this.voice.hasVoiceNoteSupport()) {
      const recordBtn = document.createElement('button');
      recordBtn.type = 'button';
      recordBtn.className = 'btn-outline';
      recordBtn.textContent = `🎙️ ${t.recordVoiceNote}`;

      const recBar = document.createElement('div');
      recBar.className = 'recording-bar';
      recBar.style.display = 'none';
      recBar.setAttribute('role', 'status');

      const recText = document.createElement('span');
      recText.textContent = t.recordingActive;
      const stopRecBtn = document.createElement('button');
      stopRecBtn.type = 'button';
      stopRecBtn.className = 'btn-danger';
      stopRecBtn.textContent = t.stopRecording;

      stopRecBtn.addEventListener('click', () => {
        this.voice.stopVoiceNote();
      });

      recBar.appendChild(recText);
      recBar.appendChild(stopRecBtn);

      recordBtn.addEventListener('click', async () => {
        if (this.isRecording) {
          this.voice.stopVoiceNote();
          return;
        }
        try {
          this.voice.stop();
          this.isRecording = true;
          recordBtn.disabled = true;
          recBar.style.display = 'flex';
          const meta = await this.voice.startVoiceNote();
          this.engine.addVoiceNote(step.key, meta);
          currentPreviewUrl = meta.previewUrl || null;
          statusText.textContent = `${t.voiceNoteSaved} (${Math.max(1, Math.round(meta.sizeBytes / 1024))} ${t.unitKb})`;
          readBackBtn.style.display = 'none';
          playNoteBtn.style.display = currentPreviewUrl ? 'inline-flex' : 'none';
          statusNote.style.display = 'flex';
          this.announce(t.voiceNoteSaved);
        } catch {
          statusText.textContent = t.voiceUnavailable;
          readBackBtn.style.display = 'none';
          playNoteBtn.style.display = 'none';
          statusNote.style.display = 'flex';
        } finally {
          this.isRecording = false;
          recordBtn.disabled = false;
          recBar.style.display = 'none';
        }
      });

      controls.appendChild(recordBtn);
      formGroup.appendChild(controls);
      formGroup.appendChild(recBar);
      formGroup.appendChild(statusNote);
    } else {
      formGroup.appendChild(controls);
      formGroup.appendChild(statusNote);
    }
  }

  async handleContinue() {
    const step = this.engine.currentStep;
    const validation = this.engine.validate(step);

    if (!validation.valid) {
      const errorEl = this.shadow.getElementById(`error-${step.key}`);
      if (errorEl) {
        errorEl.textContent = validation.error;
        errorEl.style.display = 'flex';
      }

      const firstInput = this.shadow.querySelector(`#field-${step.key}, input[name="${step.key}"]`);
      if (firstInput) {
        firstInput.classList.add('error');
        firstInput.setAttribute('aria-invalid', 'true');
        firstInput.focus();
      }

      this.announce(validation.error);
      if (this.voice.enabled) {
        this.voice.speak(validation.error);
      }
      return;
    }

    if (!this.engine.isLast) {
      this.voice.stop();
      this.engine.next();
      await this.saveDraft();
      this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
      return;
    }

    if (this.engine.flowKey === 'registration') {
      const consentCheck = this.shadow.getElementById('consent-check');
      const consentErr = this.shadow.getElementById('error-consent');
      if (consentCheck && !consentCheck.checked) {
        const msg = this.locale.validation.consentRequired;
        if (consentErr) {
          consentErr.textContent = msg;
          consentErr.style.display = 'flex';
        }
        consentCheck.setAttribute('aria-invalid', 'true');
        consentCheck.focus();
        this.announce(msg);
        if (this.voice.enabled) this.voice.speak(msg);
        return;
      }
    }

    await this.completeFlow();
  }

  async completeFlow() {
    this.voice.stop();
    const consentAccepted = this.engine.flowKey === 'registration'
      ? Boolean(this.shadow.getElementById('consent-check')?.checked ?? true)
      : true;
    const { isSignin, signinDetail, doneDetail, supportDetail } =
      this.engine.buildSubmissionPayloads(this.activeSubmissionId, { consentAccepted });

    if (isSignin) {
      this.host.dispatchEvent(
        new CustomEvent('db-signup:signin', {
          bubbles: true,
          composed: true,
          detail: signinDetail
        })
      );
      await this.storage.clear(this.engine.flowKey);
      this.renderSigninCompletion();
      return;
    }

    if (supportDetail.support.length > 0 || supportDetail.preferNotToSay) {
      await this.storage.saveSupportPreferences(supportDetail.support);
    }

    let queuedOffline = false;
    if (this.api && typeof navigator !== 'undefined' && navigator.onLine === false) {
      queuedOffline = true;
      await this.storage.queuePendingSubmission({
        submissionId: this.activeSubmissionId,
        api: this.api,
        doneDetail,
        supportDetail
      });
    } else if (this.api) {
      await this.relayToApi(this.api, doneDetail, supportDetail);
    }

    this.host.dispatchEvent(
      new CustomEvent('db-signup:done', {
        bubbles: true,
        composed: true,
        detail: doneDetail
      })
    );

    if (supportDetail.support.length > 0 || supportDetail.preferNotToSay) {
      this.host.dispatchEvent(
        new CustomEvent('db-signup:support', {
          bubbles: true,
          composed: true,
          detail: supportDetail
        })
      );
    }

    await this.storage.clear(this.engine.flowKey);
    this.renderCompletion(doneDetail, queuedOffline);
  }

  async relayToApi(apiBase, doneDetail, supportDetail) {
    const cleanBase = apiBase.replace(/\/+$/, '');
    const v1Base = cleanBase.endsWith('/v1')
      ? cleanBase
      : cleanBase.endsWith('/api')
        ? `${cleanBase}/v1`
        : `${cleanBase}/api/v1`;
    try {
      const res = await fetch(`${v1Base}/learners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': doneDetail.submissionId
        },
        body: JSON.stringify({
          ...doneDetail.profile,
          consent: doneDetail.consent
        })
      });

      if (res.ok && supportDetail.support.length > 0) {
        const data = await res.json();
        if (data?.id) {
          await fetch(`${v1Base}/learners/${encodeURIComponent(data.id)}/support`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ support: supportDetail.support })
          });
        }
      }
    } catch {
      await this.storage.queuePendingSubmission({
        submissionId: doneDetail.submissionId,
        api: apiBase,
        doneDetail,
        supportDetail
      });
    }
  }

  async handleConnectivityChange() {
    const offlineBanner = this.shadow.getElementById('offline-banner');
    if (!offlineBanner) return;

    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
    if (isOffline) {
      offlineBanner.textContent = this.locale.component.offlineBanner;
      offlineBanner.style.display = 'block';
      return;
    }

    offlineBanner.style.display = 'none';

    const pending = await this.storage.getPendingSubmissions();
    if (pending.length > 0) {
      for (const item of pending) {
        try {
          await this.relayToApi(item.api, item.doneDetail, item.supportDetail);
          await this.storage.removePendingSubmission(item.submissionId);
        } catch {
          return;
        }
      }
      this.showNotice(this.locale.component.syncedSuccess);
    }
  }

  renderSigninCompletion() {
    const c = this.locale.completion;
    const questionContainer = this.shadow.getElementById('question-container');
    const buttonGroup = this.shadow.getElementById('button-group');
    const progressEl = this.shadow.getElementById('progress');

    progressEl.textContent = '';
    questionContainer.innerHTML = `
      <div class="completion">
        <h2 class="question-title" id="completion-title" tabindex="-1">${c.signinTitle}</h2>
        <p class="question-description">${c.signinMessage}</p>
      </div>
    `;
    buttonGroup.innerHTML = '';
    const restartBtn = document.createElement('button');
    restartBtn.type = 'button';
    restartBtn.className = 'btn-outline';
    restartBtn.textContent = c.restart;
    restartBtn.addEventListener('click', () => {
      this.engine.answers = {};
      this.engine.currentIndex = 0;
      this.activeSubmissionId = createSubmissionId();
      this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
    });
    buttonGroup.appendChild(restartBtn);
    this.shadow.getElementById('completion-title')?.focus();
    this.announce(c.signinTitle);
  }

  renderCompletion(doneDetail, queuedOffline) {
    const c = this.locale.completion;
    const questionContainer = this.shadow.getElementById('question-container');
    const buttonGroup = this.shadow.getElementById('button-group');
    const progressEl = this.shadow.getElementById('progress');

    progressEl.textContent = '';
    const isReferral = Boolean(doneDetail.referralCode);
    let formattedDate = doneDetail.completedAt;
    try {
      const dt = new Date(doneDetail.completedAt);
      formattedDate = this.lang.startsWith('am')
        ? new Intl.DateTimeFormat('am-ET-u-ca-ethiopic', { day: 'numeric', month: 'long', year: 'numeric' }).format(dt)
        : new Intl.DateTimeFormat('en-ET', { day: 'numeric', month: 'short', year: 'numeric' }).format(dt);
    } catch {
      // Fallback to ISO date string
    }

    questionContainer.innerHTML = `
      <div class="completion">
        <h2 class="question-title" id="completion-title" tabindex="-1">
          ${isReferral ? c.referralTitle : c.title}
        </h2>
        <p class="question-description">
          ${isReferral ? c.referralMessage : c.message}
        </p>
        ${
          isReferral
            ? `<div class="referral-box">
                <div class="referral-code">${doneDetail.referralCode}</div>
              </div>`
            : ''
        }
        ${
          queuedOffline
            ? `<div class="banner banner-offline" role="status">${this.locale.component.pendingSync}</div>`
            : ''
        }
        <p class="question-description">${c.recordedAtLabel} ${formattedDate}</p>
        <p class="question-description">${c.nextSteps}</p>
      </div>
    `;

    buttonGroup.innerHTML = '';
    const restartBtn = document.createElement('button');
    restartBtn.type = 'button';
    restartBtn.className = 'btn-outline';
    restartBtn.textContent = c.restart;
    restartBtn.addEventListener('click', () => {
      this.engine.answers = {};
      this.engine.voiceNotes = [];
      this.engine.currentIndex = 0;
      this.activeSubmissionId = createSubmissionId();
      this.renderStep({ moveFocus: true, speakStep: this.voice.enabled });
    });
    buttonGroup.appendChild(restartBtn);

    const heading = this.shadow.getElementById('completion-title');
    heading?.focus();
    this.announce(isReferral ? c.referralTitle : c.title);
  }

  dispatchStepEvent() {
    this.host.dispatchEvent(
      new CustomEvent('db-signup:step', {
        bubbles: true,
        composed: true,
        detail: {
          step: this.engine.progress.current,
          of: this.engine.progress.total,
          flow: this.engine.flowKey
        }
      })
    );
  }

  async saveDraft() {
    try {
      await this.storage.save(this.engine.flowKey, this.engine.currentIndex, this.engine.answers);
    } catch (err) {
      console.warn('Draft save warning:', err);
    }
  }

  showNotice(message) {
    const notice = this.shadow.getElementById('notice-banner');
    if (notice) {
      notice.textContent = message;
      notice.style.display = 'block';
    }
  }

  announce(message) {
    const liveRegion = this.shadow.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 20);
    }
  }
}

  class DbSignup extends HTMLElement {
    static observedAttributes = ['lang', 'mode', 'api', 'theme', 'audio-base'];

    constructor() {
      super();
      this._instance = new DbSignupComponent(this);
    }

    async connectedCallback() {
      await this._instance.mount();
    }

    disconnectedCallback() {
      this._instance.destroy();
    }

    async attributeChangedCallback(name, oldValue, newValue) {
      await this._instance.onAttributeChange(name, oldValue, newValue);
    }
  }

  if (typeof customElements !== 'undefined' && !customElements.get('db-signup')) {
    customElements.define('db-signup', DbSignup);
  }
})();
