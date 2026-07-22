/**
 * ==========================================================
 * P&G Enterprise Org Explorer
 * search.js
 * ==========================================================
 */

const Search = {

    app: null,

    initialize(app) {

        this.app = app;

        const txtSearch = document.getElementById("txtSearch");

        if (!txtSearch)
            return;

        txtSearch.addEventListener(
            "input",
            this.debounce((e) => {

                this.search(e.target.value);

            }, 250)
        );

    },

    /**
     * ======================================================
     * Search
     * ======================================================
     */

    search(text) {

        text = text.trim().toLowerCase();

        // Empty search = show complete tree
        if (text === "") {

            Tree.render(this.app.employees);

            return;

        }

        //--------------------------------------------------
        // Find matching employees
        //--------------------------------------------------

        const matches = this.app.employees.filter(employee => {

            return [

                employee.name,
                employee.title,
                employee.organization,
                employee.country,
                employee.location,
                employee.email,
                employee.phone,
                employee.building

            ]
            .filter(Boolean)
            .some(value =>
                value.toLowerCase().includes(text)
            );

        });

        //--------------------------------------------------
        // Build filtered hierarchy
        //--------------------------------------------------

        const filtered = [];
        const added = new Set();

        matches.forEach(employee => {

            this.addManagers(employee, filtered, added);

        });

        Tree.render(filtered);

    },

    /**
     * ======================================================
     * Add employee + all managers
     * ======================================================
     */

    addManagers(employee, results, added) {

        if (!employee)
            return;

        if (employee.managerId !== null) {

            const manager = this.app.findEmployee(employee.managerId);

            this.addManagers(manager, results, added);

        }

        if (!added.has(employee.id)) {

            results.push(employee);

            added.add(employee.id);

        }

    },

    /**
     * ======================================================
     * Clear Search
     * ======================================================
     */

    clear() {

        const txt = document.getElementById("txtSearch");

        if (txt)
            txt.value = "";

        Tree.render(this.app.employees);

    },

    /**
     * ======================================================
     * Debounce
     * ======================================================
     */

    debounce(callback, delay) {

        let timer;

        return (...args) => {

            clearTimeout(timer);

            timer = setTimeout(() => {

                callback(...args);

            }, delay);

        };

    }

};

window.Search = Search;