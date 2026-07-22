/**
 * ==========================================================
 * P&G Enterprise Org Explorer
 * drawer.js
 * ==========================================================
 */

const Drawer = {

    app: null,
    offcanvas: null,

    initialize(app) {

        this.app = app;

        const element = document.getElementById("employeeDrawer");

        if (element) {
            this.offcanvas = new bootstrap.Offcanvas(element);
        }

    },

    /**
     * ======================================================
     * Open Drawer
     * ======================================================
     */

    open(employee) {

        if (!employee)
            return;

        document.getElementById("employeeName").textContent = employee.name;

        const body = document.querySelector("#employeeDrawer .offcanvas-body");

        body.innerHTML = this.render(employee);

        this.registerEvents();

        this.offcanvas.show();

    },

    /**
     * ======================================================
     * Render Drawer
     * ======================================================
     */

    render(employee) {

        const manager = this.app.getManager(employee);

        const reports = this.app.getDirectReports(employee);

        return `

<div class="text-center mb-4">

    ${this.avatar(employee)}

    <h4 class="mt-3 mb-1">${employee.name}</h4>

    <div class="text-muted">

        ${employee.title || "No Title"}

    </div>

    <span class="badge bg-primary mt-2">

        ${employee.organization || ""}

    </span>

</div>

<div class="mb-4">

    <h6>Contact Information</h6>

    <table class="table table-sm">

        <tr>
            <th>Email</th>
            <td>${employee.email || "-"}</td>
        </tr>

        <tr>
            <th>Country</th>
            <td>${employee.country || "-"}</td>
        </tr>

        <tr>
            <th>Location</th>
            <td>${employee.location || "-"}</td>
        </tr>

        <tr>
            <th>Phone</th>
            <td>${employee.phone || "-"}</td>
        </tr>

        <tr>
            <th>Building</th>
            <td>${employee.building || "-"}</td>
        </tr>

        <tr>
            <th>Band</th>
            <td>${employee.band || "-"}</td>
        </tr>

    </table>

</div>

<div class="mb-4">

    <h6>Manager</h6>

    ${
        manager
            ? `
                <button
                    class="btn btn-outline-primary w-100 manager-link"
                    data-id="${manager.id}">

                    ${manager.name}

                </button>
            `
            : `<div class="text-muted">Top Level</div>`
    }

</div>

<div>

    <h6>

        Direct Reports (${reports.length})

    </h6>

    ${
        reports.length === 0
            ? `<div class="text-muted">None</div>`
            : reports.map(report => `

                <button
                    class="btn btn-outline-secondary w-100 mb-2 report-link"
                    data-id="${report.id}">

                    ${report.name}

                </button>

            `).join("")
    }

</div>

`;

    },

    /**
     * ======================================================
     * Avatar
     * ======================================================
     */

    avatar(employee) {

        if (employee.photo && employee.photo !== "") {

            return `

<img
    src="assets/img/${employee.photo}"
    class="rounded-circle border"
    width="100"
    height="100">

`;

        }

        const initials = employee.name
            .split(" ")
            .map(x => x[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        return `

<div
    class="avatar mx-auto">

    ${initials}

</div>

`;

    },

    /**
     * ======================================================
     * Events
     * ======================================================
     */

    registerEvents() {

        document
            .querySelectorAll(".manager-link")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id = Number(button.dataset.id);

                    this.open(this.app.findEmployee(id));

                });

            });

        document
            .querySelectorAll(".report-link")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id = Number(button.dataset.id);

                    this.open(this.app.findEmployee(id));

                });

            });

    }

};

window.Drawer = Drawer;