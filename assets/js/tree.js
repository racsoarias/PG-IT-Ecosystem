/**
 * ==========================================================
 * P&G Enterprise Org Explorer
 * tree.js
 * ==========================================================
 */

const Tree = {

    app: null,

    initialize(app) {
        this.app = app;
    },

    /**
     * ======================================================
     * Render Tree
     * ======================================================
     */

    render(employees) {

        const container = document.getElementById("treeContainer");

        if (!container)
            return;

        container.innerHTML = "";

        // Find roots (works for full tree and filtered trees)

        const employeeIds = new Set(
            employees.map(e => e.id)
        );

        const roots = employees.filter(employee =>
            employee.managerId === null ||
            !employeeIds.has(employee.managerId)
        );

        roots.forEach(root => {

            container.appendChild(

                this.createNode(root, employees)

            );

        });

    },

    /**
     * ======================================================
     * Create Employee Node
     * ======================================================
     */

    createNode(employee, employees) {

        const wrapper = document.createElement("div");
        wrapper.className = "employee-node";

        //------------------------------------------------------
        // Employee Card
        //------------------------------------------------------

        const card = document.createElement("div");
        card.className = "employee-card";

        card.innerHTML = `

            <div class="employee-header">

                ${this.createAvatar(employee)}

                <div class="employee-info">

                    <h5>${employee.name}</h5>

                    <div class="employee-title">

                        ${employee.title || ""}

                    </div>

                    <div class="employee-location">

                        <i class="bi bi-geo-alt"></i>

                        ${employee.country || ""}

                    </div>

                </div>

            </div>

        `;

        card.addEventListener("click", () => {

            Drawer.open(employee);

        });

        wrapper.appendChild(card);

        //------------------------------------------------------
        // Direct Reports
        //------------------------------------------------------

        const reports = employees.filter(e =>
            e.managerId === employee.id
        );

        if (reports.length > 0) {

            const toggle = document.createElement("button");

            toggle.className =
                "btn btn-sm btn-outline-secondary tree-toggle";

            toggle.innerHTML = `

                <i class="bi bi-chevron-right"></i>

                ${reports.length} Direct Report${reports.length > 1 ? "s" : ""}

            `;

            const children = document.createElement("div");

            children.className = "children collapsed";

            reports.forEach(report => {

                children.appendChild(

                    this.createNode(report, employees)

                );

            });

            toggle.addEventListener("click", (event) => {

                event.stopPropagation();

                const expanded =
                    children.classList.contains("expanded");

                if (expanded) {

                    children.classList.remove("expanded");
                    children.classList.add("collapsed");

                    toggle.innerHTML = `

                        <i class="bi bi-chevron-right"></i>

                        ${reports.length} Direct Report${reports.length > 1 ? "s" : ""}

                    `;

                }
                else {

                    children.classList.remove("collapsed");
                    children.classList.add("expanded");

                    toggle.innerHTML = `

                        <i class="bi bi-chevron-down"></i>

                        Hide

                    `;

                }

            });

            wrapper.appendChild(toggle);
            wrapper.appendChild(children);

        }

        return wrapper;

    },

    /**
     * ======================================================
     * Avatar
     * ======================================================
     */

    createAvatar(employee) {

        if (employee.photo && employee.photo !== "") {

            return `

                <img
                    src="assets/img/${employee.photo}"
                    class="avatar">

            `;

        }

        const initials = employee.name

            .split(" ")

            .map(word => word[0])

            .join("")

            .substring(0, 2)

            .toUpperCase();

        return `

            <div class="avatar">

                ${initials}

            </div>

        `;

    },

    /**
     * ======================================================
     * Expand All
     * ======================================================
     */

    expandAll() {

        document
            .querySelectorAll(".children")
            .forEach(children => {

                children.classList.remove("collapsed");
                children.classList.add("expanded");

            });

        document
            .querySelectorAll(".tree-toggle")
            .forEach(button => {

                button.innerHTML = `

                    <i class="bi bi-chevron-down"></i>

                    Hide

                `;

            });

    },

    /**
     * ======================================================
     * Collapse All
     * ======================================================
     */

    collapseAll() {

        document
            .querySelectorAll(".children")
            .forEach(children => {

                children.classList.remove("expanded");
                children.classList.add("collapsed");

            });

        document
            .querySelectorAll(".tree-toggle")
            .forEach(button => {

                const parent = button.parentElement;

                const reports = parent.querySelector(".children");

                const count = reports
                    ? reports.children.length
                    : 0;

                button.innerHTML = `

                    <i class="bi bi-chevron-right"></i>

                    ${count} Direct Report${count !== 1 ? "s" : ""}

                `;

            });

    }

};

window.Tree = Tree;