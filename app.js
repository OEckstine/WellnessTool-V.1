document.addEventListener('DOMContentLoaded', function() {

    const startBtn        = document.getElementById('startBtn');
    const backBtn         = document.getElementById('btn-back');
    const nextBtn         = document.getElementById('btn-next');
    const restartBtn      = document.getElementById('restartBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    const qNum            = document.getElementById('q-num');
    const qText           = document.getElementById('q-text');
    const qMulti          = document.getElementById('q-multi');
    const qOptions        = document.getElementById('q-options');

    const historyContainer = document.getElementById('history-container');
    const historyDisplay   = document.getElementById('history-display');
    const resultsEl        = document.getElementById('results');

    let cur = 0;
    let ans = {};

    const Qs = [
        { id: 'burnout',   text: 'How are you feeling about your energy and creative work?', multi: false, opts: ['Complete burnout — I have nothing left.', 'Unmotivated and disconnected from my work.', 'Anxious or stressed but still pushing through.', 'Okay — just exploring what\'s available.'] },
        { id: 'mental',    text: 'Are you experiencing any of the following?',               multi: true,  opts: ['Persistent sadness or depression', 'Anxiety or panic', 'Feeling isolated', 'Trouble sleeping or eating', 'None of the above'] },
        { id: 'physical',  text: 'Do you have physical concerns from your studio practice?', multi: false, opts: ['Pain or strain (wrists, back, neck, eyes).', 'Exposure to materials — solvents, dust, chemicals.', 'Not sleeping or taking care of basic health.', 'No physical concerns.'] },
        { id: 'financial', text: 'How is your financial situation affecting you?',           multi: false, opts: ['Struggling with basics — food, housing, transportation.', 'Stressed about tuition, debt, or supplies.', 'Need emergency funding quickly.', 'Manageable for now.'] },
        { id: 'academic',  text: 'Any academic challenges right now?',                       multi: true,  opts: ['Struggling with deadlines or workload', 'Conflict with a professor or advisor', 'Need disability accommodations', 'Considering a leave of absence', 'None'] },
        { id: 'community', text: 'How are you feeling socially on campus?',                  multi: false, opts: ['Very isolated — I don\'t know how to connect.', 'Looking for community around shared identities.', 'New or transferring, still finding my footing.', 'Reasonably connected.'] },
        { id: 'urgency',   text: 'How soon do you need support?',                            multi: false, opts: ['Right now — I\'m in crisis.', 'This week.', 'In the next few weeks.', 'No rush — exploring proactively.'] }
    ];

    const R = {
        crisis:     { name: '24/7 Crisis Line',             desc: 'Immediate support at any hour. Call or text 988.',                               link: 'https://jedfoundation.org/ulifeline-transition/',                                               ll: 'Visit 988lifeline.org' },
        counseling: { name: 'Student Counseling Services',   desc: 'Free, confidential therapy and crisis support for enrolled students.',           link: 'https://www.newschool.edu/health-services/counseling-services/',                 ll: 'Book an appointment' },
        coaching:   { name: 'Wellness Coaching',             desc: 'One-on-one sessions on stress, sleep, burnout, and sustainable habits.',         link: 'https://www.newschool.edu/campus-community/health-wellness-support/',           ll: 'Learn more' },
        peer:       { name: 'Peer Health Advocates',         desc: 'Trained student peers offering informal support and referrals.',                  link: 'https://narwhalnation.newschool.edu/',           ll: 'Meet the advocates' },
        health:     { name: 'Student Health Services',       desc: 'Primary care, occupational health, referrals to specialists.',                    link: 'https://www.newschool.edu/health-services/',           ll: 'Schedule a visit' },
        food:       { name: 'Campus Food Pantry',            desc: 'Free groceries and supplies. No documentation required. Also connects to SNAP.', link: 'https://www.newschool.edu/student-support/food-assistance/',                           ll: 'Access food pantry' },
        emergency:  { name: 'Student Emergency Fund',        desc: 'One-time financial assistance for unexpected hardship.',                          link: 'https://www.newschool.edu/financial-aid/new-school-scholarships/',                ll: 'Apply' },
        finaid:     { name: 'Financial Aid Office',          desc: 'Scholarships, grants, work-study, and emergency loans.',                          link: 'https://www.newschool.edu/financial-aid/',                             ll: 'Meet with an advisor' },
        disability: { name: 'Student Disability Services',   desc: 'Accommodations for disability, chronic illness, or mental health conditions.',    link: 'https://www.newschool.edu/student-disability-services/',       ll: 'Register' },
        dean:       { name: 'Dean of Students',              desc: 'Advocates for navigating conflict, leaves of absence, and complex situations.',   link: 'https://www.newschool.edu/student-support/dean-of-students/',          ll: 'Contact' },
        ombuds:     { name: 'Ombuds Office',                 desc: 'Confidential, informal conflict resolution with faculty or staff.',               link: 'https://www.newschool.edu/ombuds/',                                     ll: 'Contact' },
        writing:    { name: 'University Writing Center',     desc: 'Free writing support for papers, artist statements, and thesis.',                 link: 'https://www.newschool.edu/learning-center/#general-writing',           ll: 'Book a session' },
        orgs:       { name: 'Student Organizations',         desc: 'Cultural, discipline, and identity-based groups.',                                link: 'https://www.newschool.edu/student-leadership/',                                         ll: 'Browse groups' }
    };

    loadHistory();


    startBtn.addEventListener('click', function() {
        cur = 0;
        ans = {};
        showScreen('s-quiz');
        renderQuestion();
    });

    nextBtn.addEventListener('click', function() {
        if (cur < Qs.length - 1) {
            cur++;
            renderQuestion();
        } else {
            showResults();
        }
    });

    backBtn.addEventListener('click', function() {
        if (cur > 0) {
            cur--;
            renderQuestion();
        }
    });

    restartBtn.addEventListener('click', function() {
        showScreen('s-intro');
    });

    clearHistoryBtn.addEventListener('click', function() {
        clearHistory();
    });


    function showScreen(id) {
        var screens = document.querySelectorAll('.screen');
        screens.forEach(function(s) {
            s.classList.remove('active');
        });
        document.getElementById(id).classList.remove('hidden');
        document.getElementById(id).classList.add('active');
        window.scrollTo(0, 0);
    }

    
    function renderQuestion() {
        var q = Qs[cur];

        qNum.textContent  = (cur + 1) + ' / ' + Qs.length;
        qText.textContent = q.text;

        if (q.multi) {
            qMulti.classList.remove('hidden');
        } else {
            qMulti.classList.add('hidden');
        }

        if (cur === 0) {
            backBtn.classList.add('hidden');
        } else {
            backBtn.classList.remove('hidden');
        }

        nextBtn.textContent = cur === Qs.length - 1 ? 'See resources →' : 'Continue →';

        var saved = ans[q.id] || [];
        qOptions.innerHTML = '';

        q.opts.forEach(function(optText, i) {
            var btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = optText;

            if (saved.includes(i)) {
                btn.classList.add('selected');
            }

            btn.addEventListener('click', function() {
                pickOption(i, btn, q);
            });

            qOptions.appendChild(btn);
        });

        updateNextBtn();
    }


    function pickOption(i, btn, q) {
        if (!ans[q.id]) {
            ans[q.id] = [];
        }

        if (q.multi) {
            var lastIdx = q.opts.length - 1;

            if (i === lastIdx) {
                ans[q.id] = [lastIdx];
            } else {
                ans[q.id] = ans[q.id].filter(function(k) { return k !== lastIdx; });

                var x = ans[q.id].indexOf(i);
                if (x > -1) {
                    ans[q.id].splice(x, 1);
                } else {
                    ans[q.id].push(i);
                }
            }

            var allBtns = document.querySelectorAll('.option');
            allBtns.forEach(function(b, j) {
                if (ans[q.id].includes(j)) {
                    b.classList.add('selected');
                } else {
                    b.classList.remove('selected');
                }
            });

        } else {
            ans[q.id] = [i];
            var allBtns = document.querySelectorAll('.option');
            allBtns.forEach(function(b) {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
        }

        updateNextBtn();
    }

   
    function updateNextBtn() {
        var hasAnswer = ans[Qs[cur].id] && ans[Qs[cur].id].length > 0;
        nextBtn.disabled = !hasAnswer;
    }

  
function showResults() {
    showScreen('s-results');

    var mental = [];
    var phys   = [];
    var fin    = [];
    var acad   = [];
    var comm   = [];

    var urgency   = (ans['urgency']   || [])[0];
    var burnout   = (ans['burnout']   || [])[0];
    var community = (ans['community'] || [])[0];

    function has(key, i) { return (ans[key] || []).includes(i); }

    if (urgency === 0) mental.push(R.crisis);
    if (burnout === 0 || burnout === 1 || burnout === 2 || has('mental', 0) || has('mental', 1) || has('mental', 2) || has('mental', 3)) mental.push(R.counseling);
    if (burnout === 0 || burnout === 1) mental.push(R.coaching);
    if (has('mental', 2) || community === 0) mental.push(R.peer);
    if (mental.length === 0) mental.push(R.coaching);

    if ((ans['physical'] || [])[0] === 0 || (ans['physical'] || [])[0] === 2) phys.push(R.health);
    if ((ans['physical'] || [])[0] === 1) { phys.push(R.ehs); phys.push(R.health); }

    var financial = (ans['financial'] || [])[0];
    if (financial === 0) { fin.push(R.food); fin.push(R.emergency); }
    if (financial === 1) fin.push(R.finaid);
    if (financial === 2) { fin.push(R.emergency); fin.push(R.finaid); }
    if (financial === 3) fin.push(R.finaid);

    if (has('academic', 0)) { acad.push(R.writing); acad.push(R.dean); }
    if (has('academic', 1)) { acad.push(R.ombuds);  acad.push(R.dean); }
    if (has('academic', 2)) acad.push(R.disability);
    if (has('academic', 3)) acad.push(R.dean);
    if (acad.length === 0)  acad.push(R.writing);

    if (community === 0 || community === 1 || community === 2) comm.push(R.peer);
    comm.push(R.orgs);

    var sections = [
        { label: 'Mental Health',     items: mental },
        { label: 'Physical Health',   items: phys   },
        { label: 'Financial Support', items: fin    },
        { label: 'Academic Support',  items: acad   },
        { label: 'Community',         items: comm   }
    ];

    resultsEl.innerHTML = '';

    sections.forEach(function(sec) {
        var seen = {};
        var deduped = sec.items.filter(function(r) {
            if (!r || seen[r.name]) return false;
            seen[r.name] = true;
            return true;
        });

        if (deduped.length === 0) return;

        var section = document.createElement('div');
        section.className = 'section';

        var title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = sec.label;
        section.appendChild(title);

        deduped.forEach(function(r) {
            var card = document.createElement('div');
            card.className = 'card';

            var name = document.createElement('div');
            name.className = 'card-name';
            name.textContent = r.name;

            var desc = document.createElement('div');
            desc.className = 'card-desc';
            desc.textContent = r.desc;

            var link = document.createElement('a');
            link.href = r.link;
            link.target = '_blank';
            link.textContent = r.ll + ' ↗';

            card.appendChild(name);
            card.appendChild(desc);
            card.appendChild(link);
            section.appendChild(card);
        });

        resultsEl.appendChild(section);
    });

    populateFeedbackDropdown(sections);
    resetFeedbackForm();
    loadFeedbackHistory();

    saveHistory();
}


    
    function saveHistory() {
        try {
            var session = {
                date: new Date().toLocaleDateString()
            };
            localStorage.setItem('tns_wellness_lastSession', JSON.stringify(session));
            displayHistory(session);
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }

    function loadHistory() {
        try {
            var stored = localStorage.getItem('tns_wellness_lastSession');
            if (stored) {
                var data = JSON.parse(stored);
                displayHistory(data);
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    }

    function displayHistory(data) {
        historyDisplay.textContent = 'Last visit: ' + data.date;
        historyContainer.classList.remove('hidden');
    }

    
    function clearHistory() {
        try {
            localStorage.removeItem('tns_wellness_lastSession');
            historyContainer.classList.add('hidden');
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    }


    function populateFeedbackDropdown(sections) {
        var select = document.getElementById('feedback-resource');
        select.innerHTML = '<option value="">— Select a resource —</option>';

        sections.forEach(function(sec) {
            var seen = {};
            sec.items.forEach(function(r) {
                if (!r || seen[r.name]) return;
                seen[r.name] = true;
                var opt = document.createElement('option');
                opt.value = r.name;
                opt.textContent = '[' + sec.label + '] ' + r.name;
                select.appendChild(opt);
            });
        });
    }

    var selectedRating = null;

    document.querySelectorAll('.feedback-rating').forEach(function(btn) {
        btn.addEventListener('click', function() {
            selectedRating = this.dataset.val;
            document.querySelectorAll('.feedback-rating').forEach(function(b) {
                b.style.background = '';
                b.style.color = '';
            });
            this.style.background = 'black';
            this.style.color = 'white';
        });
    });

    document.getElementById('submit-feedback').addEventListener('click', function() {
        var resource = document.getElementById('feedback-resource').value;
        var comment  = document.getElementById('feedback-comment').value.trim();

        if (!resource) { alert('Please select a resource.'); return; }
        if (!selectedRating) { alert('Please select 👍 or 👎.'); return; }

        var entry = {
            resource: resource,
            helpful:  selectedRating,
            comment:  comment,
            date:     new Date().toLocaleDateString()
        };

        saveFeedbackEntry(entry);
        document.getElementById('feedback-thanks').classList.remove('hidden');
        document.getElementById('submit-feedback').disabled = true;
        loadFeedbackHistory();
    });

    function resetFeedbackForm() {
        selectedRating = null;
        document.getElementById('feedback-comment').value = '';
        document.getElementById('feedback-thanks').classList.add('hidden');
        document.getElementById('submit-feedback').disabled = false;
        document.querySelectorAll('.feedback-rating').forEach(function(b) {
            b.style.background = '';
            b.style.color = '';
        });
    }

    function saveFeedbackEntry(entry) {
        try {
            var existing = JSON.parse(localStorage.getItem('tns_feedback') || '[]');
            existing.unshift(entry); // newest first
            localStorage.setItem('tns_feedback', JSON.stringify(existing));
        } catch(e) { console.error('Feedback save error:', e); }
    }

    function loadFeedbackHistory() {
        try {
            var entries = JSON.parse(localStorage.getItem('tns_feedback') || '[]');
            var section = document.getElementById('feedback-history-section');
            var list    = document.getElementById('feedback-history-list');

            if (entries.length === 0) { section.classList.add('hidden'); return; }

            section.classList.remove('hidden');
            list.innerHTML = '';

            entries.forEach(function(e) {
                var item = document.createElement('div');
                item.style.cssText = 'border:1px solid #ccc; padding:10px; margin-bottom:8px;';
                item.innerHTML =
                    '<strong>' + e.resource + '</strong> — ' +
                    (e.helpful === 'yes' ? '👍 Helpful' : '👎 Not helpful') +
                    ' <span style="color:#888; font-size:0.85em;">(' + e.date + ')</span>' +
                    (e.comment ? '<br><em>' + e.comment + '</em>' : '');
                list.appendChild(item);
            });
        } catch(e) { console.error('Feedback load error:', e); }
    }

    document.getElementById('clear-feedback-btn').addEventListener('click', function() {
        localStorage.removeItem('tns_feedback');
        loadFeedbackHistory();
    });

}); 