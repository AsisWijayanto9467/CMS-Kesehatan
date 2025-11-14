export const menuItems = [
  {
    key: "dashboard",
    icon: "fas fa-tachometer-alt",
    text: "Dashboard",
    link: "/admin/dashboard",
  },
  {
    key: "obat",
    icon: "fas fa-pills",
    text: "Obat",
    link: "/admin/obat",
  },
  {
    key: "suplemen",
    icon: "fas fa-capsules",
    text: "Suplemen",
    link: "/admin/suplemen",
  },
  {
    key: "penyakit",
    icon: "fas fa-virus",
    text: "Penyakit",
    link: "/admin/penyakit",
  },
  {
    key: "kategori",
    icon: "fas fa-layer-group",
    text: "Kategori",
    submenu: [
      { text: "Kategori Obat", link: "/admin/kategori-obat", icon: "fas fa-capsules" },
      { text: "Kategori Suplemen", link: "/admin/kategori-suplemen", icon: "fas fa-pills" },
      { text: "Kategori Penyakit", link: "/admin/kategori-penyakit", icon: "fas fa-virus" },
    ],
  },
  {
    key: "users",
    icon: "fas fa-users",
    text: "Users",
    link: "/admin/users",
  },
];
