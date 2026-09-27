/* Small shared interactions used across screens. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Clicking anywhere on a radio-row / selectable-card selects its radio
    // and toggles the "selected" style, mirroring the Figma component states.
    document.querySelectorAll('.radio-row, .selectable-card').forEach(function (row) {
      row.addEventListener('click', function (e) {
        var radio = row.querySelector('input[type=radio]');
        if (!radio) return;
        if (e.target !== radio) radio.checked = true;
        var group = radio.name;
        document.querySelectorAll('input[type=radio][name="' + group + '"]').forEach(function (r) {
          r.closest('.radio-row, .selectable-card').classList.toggle('selected', r.checked);
        });
      });
    });
  });
})();
