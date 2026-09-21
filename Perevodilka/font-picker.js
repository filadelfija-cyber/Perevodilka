/* font-picker.js — выпадающий выбор шрифта для панели вывода */
(function () {
    // Только современные Unicode-шрифты из fonts.css, отсортированы по алфавиту
    const FONTS = [
        { value: "'Acathist-Regular', serif",       label: "Acathist" },
        { value: "'Cathisma-Regular', serif",       label: "Cathisma" },
        { value: "'Fedorovsk-Regular', serif",      label: "Fedorovsk" },
        { value: "'FiraSlav-Regular', serif",       label: "FiraSlav" },
        { value: "'Indiction-Regular', serif",      label: "Indiction" },
        { value: "'Menaion-Regular', serif",        label: "Menaion" },
        { value: "'Monomakh-Regular', serif",       label: "Monomakh" },
        { value: "'Oglavie-Regular', serif",        label: "Oglavie" },
        { value: "'Pochaevsk-Regular', serif",      label: "Pochaevsk" },
        { value: "'Pomorsky-Regular', serif",       label: "Pomorsky" },
        { value: "'Ponomar-Regular', serif",        label: "Ponomar" },
        { value: "'Shafarik-Regular', serif",       label: "Shafarik" },
        { value: "'Triodion-Regular', serif",       label: "Triodion" },
        { value: "'Vertograd-Regular', serif",      label: "Vertograd" },
        { value: "'Vilnius-Regular', serif",        label: "Vilnius" },
        { value: "'Voskresensky-Regular', serif",   label: "Voskresensky" },
    ];

    const DEFAULT_FONT = "'Ponomar-Regular', serif";
    const STORAGE_KEY  = "slavonic-output-font";

    function buildPicker(notes, slavonic) {
        const wrapper = document.createElement("div");
        wrapper.className = "font-picker";
        wrapper.style.cssText = "margin-left: 1em; display: inline-block;";

        const label = document.createElement("label");
        label.textContent = "Шрифт: ";
        label.style.cssText = "margin-right: 0.4em;";

        const select = document.createElement("select");
        select.id = "font-picker-select";
        for (const f of FONTS) {
            const opt = document.createElement("option");
            opt.value = f.value;
            opt.textContent = f.label;
            select.appendChild(opt);
        }

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        notes.appendChild(wrapper);

        let saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
        if (saved && FONTS.some(f => f.value === saved)) {
            select.value = saved;
            slavonic.style.fontFamily = saved;
        } else {
            select.value = DEFAULT_FONT;
            slavonic.style.fontFamily = DEFAULT_FONT;
        }

        select.addEventListener("change", () => {
            slavonic.style.fontFamily = select.value;
            try { localStorage.setItem(STORAGE_KEY, select.value); } catch (_) {}
        });
    }

    function init() {
        const notes = document.querySelector(".notes");
        const slavonic = document.querySelector(".slavonic");
        if (!notes || !slavonic) return setTimeout(init, 100);
        if (document.getElementById("font-picker-select")) return;
        buildPicker(notes, slavonic);
        console.log("[font-picker] готово, доступно шрифтов:", FONTS.length);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();