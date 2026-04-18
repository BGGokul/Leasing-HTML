function handleSidebarToggle() {
  const layout = document.getElementById("layout");

  if (window.innerWidth < 992) {
    layout.classList.toggle("mobile-open");
  } else {
    layout.classList.toggle("collapsed");
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function closeMobileSidebar() {
  document.getElementById("layout").classList.remove("mobile-open");
}

function toggleSubmenu() {
  document.getElementById("submenu").classList.toggle("d-none");
}

// Table sorting, filter, search

document.addEventListener("DOMContentLoaded", () => {
  class SmartTable {
    constructor(el) {
      this.el = el;
      this.direction = {};

      this.initSearch();
      this.initToggle();
      this.initSort();
    }

    // 👉 GET ACTIVE TABLE (IMPORTANT)
    getActiveTable() {
      return this.el.querySelector(".tab-pane.active .table-main");
    }

    // 🔍 SEARCH
    initSearch() {
      const inputs = this.el.querySelectorAll(".table-search");

      inputs.forEach((input) => {
        input.addEventListener("keyup", () => {
          const tabPane = input.closest(".tab-pane");
          if (!tabPane) return;

          const table = tabPane.querySelector(".table-main");
          if (!table) return;

          const val = input.value.toLowerCase();

          table.querySelectorAll("tbody tr").forEach((row) => {
            row.style.display = row.innerText.toLowerCase().includes(val)
              ? ""
              : "none";
          });
        });
      });
    }

    // 👁 COLUMN TOGGLE
    initToggle() {
      const checks = this.el.querySelectorAll(".col-toggle");

      checks.forEach((cb) => {
        cb.addEventListener("change", () => {
          const table = this.getActiveTable();
          if (!table) return;

          const col = cb.dataset.col;

          table.querySelectorAll(".col-" + col).forEach((cell) => {
            cell.style.display = cb.checked ? "" : "none";
          });
        });
      });
    }

    // 🔽 SORT
    initSort() {
      const headers = this.el.querySelectorAll(".sortable");

      headers.forEach((th) => {
        th.addEventListener("click", () => {
          const table = this.getActiveTable();
          if (!table) return;

          const col = th.dataset.col;

          this.direction[col] = !this.direction[col];
          const dir = this.direction[col] ? 1 : -1;

          const rows = Array.from(table.tBodies[0].rows);

          rows.sort((a, b) => {
            let A = a.querySelector(".col-" + col)?.innerText.trim() || "";
            let B = b.querySelector(".col-" + col)?.innerText.trim() || "";

            if (!isNaN(A) && !isNaN(B)) {
              return (A - B) * dir;
            }

            return A.localeCompare(B) * dir;
          });

          table.tBodies[0].append(...rows);
        });
      });
    }
  }

  // ✅ INIT ALL TABLE WRAPPERS
  document.querySelectorAll(".smart-table").forEach((t) => {
    new SmartTable(t);
  });
});
