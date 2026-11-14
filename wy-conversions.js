/* With You Agency: Google Ads contact-click measurement, consent required. */
(() => {
  'use strict';
  const ADS_ID = 'AW-11466731418';
  const DESTINATION = ADS_ID + '/mQjKCNryxLgdEJrf4dsq';
  const KEY = 'wy_measurement_consent_v1';
  let allowed = false;
  let loaded = false;
  let recorded = false;
  window.dataLayer = window.dataLayer || [];
  const tag = function () { window.dataLayer.push(arguments); };
  tag('consent', 'default', {
    ad_storage: 'denied', analytics_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  function remember(value) {
    try { localStorage.setItem(KEY, JSON.stringify({ value, time: Date.now() })); } catch (_) {}
  }
  function enable() {
    allowed = true;
    tag('consent', 'update', {
      ad_storage: 'granted', analytics_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    if (loaded) return;
    loaded = true;
    tag('js', new Date());
    tag('config', ADS_ID, { allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS_ID;
    document.head.appendChild(script);
  }
  function disable() {
    allowed = false;
    tag('consent', 'update', {
      ad_storage: 'denied', analytics_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    document.cookie.split(';').forEach(part => {
      const name = part.trim().split('=')[0];
      if (!name.startsWith('_gcl_')) return;
      ['', location.hostname, '.' + location.hostname, '.withyouagency.it'].forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax; Secure' + (domain ? '; domain=' + domain : '');
      });
    });
  }
  function start() {
    const style = document.createElement('style');
    style.textContent = '#wy-consent{position:fixed;z-index:99999;bottom:16px;left:16px;right:16px;max-width:760px;margin:auto;padding:20px;background:#fff;color:#102334;border:1px solid #c9d2db;border-radius:14px;box-shadow:0 8px 40px #0004;font:15px/1.5 system-ui,sans-serif}#wy-consent[hidden]{display:none}#wy-consent p{margin:0 0 12px}#wy-consent a{color:#103c76;text-decoration:underline}#wy-consent .wy-actions{display:flex;gap:12px;flex-wrap:wrap}#wy-consent button{font:600 15px system-ui;padding:11px 18px;min-height:44px;background:#102334;color:#fff;border:1px solid #102334;border-radius:7px;cursor:pointer}#wy-consent button:focus-visible,#wy-preferences:focus-visible{outline:3px solid #d02172;outline-offset:3px}#wy-preferences{display:block;margin:14px auto;background:transparent;color:inherit;border:1px solid currentColor;border-radius:6px;padding:8px 12px;font:inherit;cursor:pointer}';
    document.head.appendChild(style);
    const panel = document.createElement('section');
    panel.id = 'wy-consent';
    panel.setAttribute('aria-label', 'Preferenze misurazione pubblicitaria');
    panel.innerHTML = '<p><strong>Misurazione degli annunci</strong></p><p>Con il tuo consenso utilizziamo Google Ads per misurare le visite provenienti dagli annunci e i clic su “Scrivici”, tramite cookie e dati di navigazione. Il clic non conferma l’invio di un’email. Non attiviamo pubblicità personalizzata. Puoi rifiutare e usare tutti i servizi, oppure cambiare scelta dal pulsante “Preferenze cookie” a fondo pagina. <a href="https://policies.google.com/technologies/partner-sites?hl=it" target="_blank" rel="noopener noreferrer">Come Google utilizza i dati</a>. Titolare: With You SRL, <a href="mailto:info@withyouagency.it">info@withyouagency.it</a>. La scelta viene conservata per 6 mesi.</p><div class="wy-actions"><button type="button" id="wy-accept">Accetta misurazione</button><button type="button" id="wy-reject">Rifiuta misurazione</button></div>';
    document.body.appendChild(panel);
    const preference = document.createElement('button');
    preference.type = 'button';
    preference.id = 'wy-preferences';
    preference.textContent = 'Preferenze cookie';
    (document.querySelector('footer') || document.body).appendChild(preference);
    preference.addEventListener('click', () => {
      panel.hidden = false;
      document.getElementById('wy-accept').focus();
    });
    const choose = value => {
      remember(value);
      value === 'accepted' ? enable() : disable();
      panel.hidden = true;
    };
    document.getElementById('wy-accept').addEventListener('click', () => choose('accepted'));
    document.getElementById('wy-reject').addEventListener('click', () => choose('rejected'));
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && Date.now() - saved.time < 180 * 86400000 && ['accepted', 'rejected'].includes(saved.value)) {
        if (saved.value === 'accepted') enable();
        panel.hidden = true;
      }
    } catch (_) {}
    document.addEventListener('click', event => {
      const link = event.target.closest && event.target.closest('a[href^="mailto:"]');
      if (!allowed || recorded || !link || link.closest('#wy-consent')) return;
      if (!/^mailto:info@withyouagency\.it(?:\?|$)/i.test(link.getAttribute('href'))) return;
      recorded = true;
      tag('event', 'conversion', { send_to: DESTINATION });
      // The email link keeps its normal behaviour, even if Google is blocked.
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
