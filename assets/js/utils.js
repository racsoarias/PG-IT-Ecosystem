/**
 * ==========================================================
 * P&G Enterprise Org Explorer
 * utils.js
 * ==========================================================
 */

const Utils = {

    /**
     * ======================================================
     * Generate Initials
     * ======================================================
     */
    getInitials(name) {

        if (!name)
            return "";

        return name
            .trim()
            .split(/\s+/)
            .map(word => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();

    },

    /**
     * ======================================================
     * Escape HTML
     * ======================================================
     */
    escapeHtml(value) {

        if (value == null)
            return "";

        const div = document.createElement("div");

        div.textContent = value;

        return div.innerHTML;

    },

    /**
     * ======================================================
     * Debounce
     * ======================================================
     */
    debounce(callback, delay = 250) {

        let timer;

        return (...args) => {

            clearTimeout(timer);

            timer = setTimeout(() => {

                callback(...args);

            }, delay);

        };

    },

    /**
     * ======================================================
     * Find Employee
     * ======================================================
     */
    findEmployee(employees, id) {

        return employees.find(e => e.id === id);

    },

    /**
     * ======================================================
     * Get Manager
     * ======================================================
     */
    getManager(employees, employee) {

        if (!employee || employee.managerId === null)
            return null;

        return employees.find(e => e.id === employee.managerId);

    },

    /**
     * ======================================================
     * Get Direct Reports
     * ======================================================
     */
    getDirectReports(employees, employee) {

        return employees.filter(e => e.managerId === employee.id);

    },

    /**
     * ======================================================
     * Get Hierarchy
     * ======================================================
     */
    getHierarchy(employees, employee) {

        const hierarchy = [];

        let current = employee;

        while (current) {

            hierarchy.unshift(current);

            current = this.getManager(employees, current);

        }

        return hierarchy;

    },

    /**
     * ======================================================
     * Count Managers
     * ======================================================
     */
    countManagers(employees) {

        return employees.filter(employee =>

            employees.some(report => report.managerId === employee.id)

        ).length;

    },

    /**
     * ======================================================
     * Unique Values
     * ======================================================
     */
    uniqueCount(employees, property) {

        return new Set(

            employees
                .map(e => e[property])
                .filter(Boolean)

        ).size;

    },

    /**
     * ======================================================
     * Sort By Name
     * ======================================================
     */
    sortByName(employees) {

        return [...employees].sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    },

    /**
     * ======================================================
     * Format Empty Values
     * ======================================================
     */
    value(value, empty = "-") {

        if (value === null || value === undefined || value === "")
            return empty;

        return value;

    },

    /**
     * ======================================================
     * Local Storage
     * ======================================================
     */
    save(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    },

    load(key, defaultValue = null) {

        const value = localStorage.getItem(key);

        if (value === null)
            return defaultValue;

        try {

            return JSON.parse(value);

        }
        catch {

            return defaultValue;

        }

    },

    /**
     * ======================================================
     * Toggle Favorite
     * ======================================================
     */
    toggleFavorite(id) {

        let favorites = this.load("favorites", []);

        if (favorites.includes(id)) {

            favorites = favorites.filter(x => x !== id);

        }
        else {

            favorites.push(id);

        }

        this.save("favorites", favorites);

        return favorites;

    },

    isFavorite(id) {

        const favorites = this.load("favorites", []);

        return favorites.includes(id);

    }

};

window.Utils = Utils;