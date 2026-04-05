function createBallotRows() {
  const container = document.getElementById('ballot-container');
  const blurTexts = [
    'Aswin R. M.',
    'Jane Doe Placeholder',
    '', // Row 3 handled explicitly
    'Candidate Four Name',
    'Short Name',
    'Final Example',
    'Empty Placeholder',
    'Empty Placeholder',
    'Empty Placeholder',
    'Empty Placeholder'
  ];

  let html = '';
  for (let i = 1; i <= 10; i++) {
    const isRow3 = i === 3;
    const serial = i <= 6 ? i + '.' : '';
    const buttonClass = isRow3 ? 'button-pill active' : 'button-pill';
    const activeBtnId = isRow3 ? 'id="active-button"' : '';
    const activeArrowId = isRow3 ? 'id="active-arrow"' : '';
    
    let leftContent = '';
    
    if (isRow3) {
      leftContent = `
        <div class="serial" style="font-size: 15px;">${serial}</div>
        <div class="candidate-details">
          <div class="candidate-text">
            <div class="malayalam-name">കുന്നത്ത് മുഹമ്മദ് S/o ആലി ഹാജി</div>
            <div class="english-name">Kunnath Muhammed S/o Ali Haji</div>
          </div>
          <img src="images/candidate_photo.png" class="candidate-photo" alt="Candidate Photo">
          <img src="images/symbol.png" class="candidate-symbol" alt="Symbol">
        </div>
      `;
    } else {
      const styleOpacity = i > 6 ? 'opacity: 0.1;' : 'opacity: 0.3;';
      leftContent = `
        <div class="serial">${serial}</div>
        <div class="candidate-name" style="${styleOpacity}">
          <span>${blurTexts[i-1]}</span>
        </div>
      `;
    }

    html += `
      <div class="ballot-row">
        <div class="row-left">
          ${leftContent}
        </div>
        <div class="row-right">
          <div class="arrow" ${activeArrowId}>
            <svg width="22" height="16" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0L0 9L10 18V12H24V6H10V0Z" fill="#B91C1C"/>
            </svg>
          </div>
          <div class="${buttonClass}" ${activeBtnId} style="${isRow3 ? 'cursor: pointer;' : ''}"></div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;

  const btn = document.getElementById('active-button');
  const arrow = document.getElementById('active-arrow');
  let isVoting = false;

  if (btn && arrow) {
    btn.addEventListener('click', () => {
      if (isVoting) return;
      isVoting = true;

      arrow.classList.add('arrow-active');

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'triangle'; // Smoother tone
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      
      // Smooth ADSR envelope to prevent harsh clicking sounds
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime + 0.95);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();

      setTimeout(() => {
        oscillator.stop();
        arrow.classList.remove('arrow-active');
        
        const modal = document.getElementById('success-modal');
        if (modal) {
          modal.classList.add('show');
        }
      }, 1000);
    });
  }

  const modal = document.getElementById('success-modal');
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      
      setTimeout(() => {
        isVoting = false;
      }, 300);
    });
  }
}

document.addEventListener('DOMContentLoaded', createBallotRows);

// Turn on the ready LED when the full page is loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.ready-led').classList.add('on');
  }, 400); // 400ms delay to make it noticeable
});
