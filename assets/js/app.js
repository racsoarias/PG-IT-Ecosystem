/**
 * ==========================================================
 * P&G Enterprise Org Explorer
 * app.js
 * ==========================================================
 */

class OrgExplorer {

    constructor() {

        this.employees = [];
        this.selectedEmployee = null;

        this.statistics = {
            employees: 0,
            managers: 0,
            countries: 0,
            organizations: 0
        };

    }

    /**
     * ======================================================
     * Initialize Application
     * ======================================================
     */
    async initialize() {

        try {

            console.log("Starting Org Explorer...");

            this.initializeTheme();

            await this.loadEmployees();

            this.calculateStatistics();

            this.renderStatistics();

            if (window.Tree) {

                Tree.initialize(this);
                Tree.render(this.employees);

            }

            if (window.Drawer) {

                Drawer.initialize(this);

            }

            if (window.Search) {

                Search.initialize(this);

            }

            console.log("Application Ready");

        }
        catch (error) {

            console.error(error);

            this.showError(error);

        }

    }

    /**
     * ======================================================
     * Load Employees
     * ======================================================
     */
    async loadEmployees() {

        const response = await fetch("assets/data/employees.json");

        if (!response.ok) {

            throw new Error("Unable to load employees.json");

        }

        this.employees = await response.json();

        console.log(`Loaded ${this.employees.length} employees`);

    }

    /**
     * ======================================================
     * Statistics
     * ======================================================
     */
    calculateStatistics() {

        this.statistics.employees = this.employees.length;

        this.statistics.managers = this.employees.filter(employee =>
            this.employees.some(report => report.managerId === employee.id)
        ).length;

        this.statistics.countries = new Set(
            this.employees
                .map(e => e.country)
                .filter(c => c && c.length > 0)
        ).size;

        this.statistics.organizations = new Set(
            this.employees
                .map(e => e.organization)
                .filter(o => o && o.length > 0)
        ).size;

    }

    /**
     * ======================================================
     * Dashboard
     * ======================================================
     */
    renderStatistics() {

        document.getElementById("employeeCount").textContent =
            this.statistics.employees;

        document.getElementById("managerCount").textContent =
            this.statistics.managers;

        document.getElementById("countryCount").textContent =
            this.statistics.countries;

        document.getElementById("organizationCount").textContent =
            this.statistics.organizations;

    }

    /**
     * ======================================================
     * Theme
     * ======================================================
     */
    initializeTheme() {

        const theme = localStorage.getItem("theme") || "light";

        document.documentElement.dataset.theme = theme;

        document
            .getElementById("btnTheme")
            ?.addEventListener("click", () => {

                this.toggleTheme();

            });

    }

    toggleTheme() {

        const current = document.documentElement.dataset.theme;

        const next = current === "dark"
            ? "light"
            : "dark";

        document.documentElement.dataset.theme = next;

        localStorage.setItem("theme", next);

    }

    /**
     * ======================================================
     * Employee Helpers
     * ======================================================
     */
    findEmployee(id) {

        return this.employees.find(e => e.id === id);

    }

    getManager(employee) {

        return this.findEmployee(employee.managerId);

    }

    getDirectReports(employee) {

        return this.employees.filter(e => e.managerId === employee.id);

    }

    /**
     * ======================================================
     * Refresh
     * ======================================================
     */
    refresh() {

        this.calculateStatistics();

        this.renderStatistics();

        Tree.render(this.employees);

    }

    /**
     * ======================================================
     * Error
     * ======================================================
     */
    showError(error) {

        console.error(error);

        const tree = document.getElementById("treeContainer");

        if (!tree)
            return;

        tree.innerHTML = `

            <div class="alert alert-danger">

                <h4>Application Error</h4>

                <p>${error.message}</p>

            </div>

        `;

    }

}

/**
 * ==========================================================
 * Global Application
 * ==========================================================
 */

const App = new OrgExplorer();

window.App = App;

/**
 * ==========================================================
 * Start Application
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", async () => {

    await App.initialize();

    document
        .getElementById("btnExpandAll")
        ?.addEventListener("click", () => {

            Tree.expandAll();

        });

    document
        .getElementById("btnCollapseAll")
        ?.addEventListener("click", () => {

            Tree.collapseAll();

        });

});