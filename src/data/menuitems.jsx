import { FaBus, FaFileArchive, FaBusinessTime } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { FaListCheck } from "react-icons/fa6";
import {
  MdFeaturedPlayList,
  MdOutlineDescription,
  MdBrowserUpdated,
} from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";

export const MenuItems = [
  {
    icon: <FaBus size={20} />,
    text: "Taşıtlar",
    path: "/",
  },
  {
    icon: <FaBusinessTime size={20} />,
    text: "Servis Sıra Düzenleme",
    path: "#",
  },
  {
    icon: <TbListDetails size={20} />,
    text: "Servis Detay",
    path: "servis-detay",
  },
  {
    icon: <FaListCheck size={20} />,
    text: "Plan Seçimi",
    path: "#",
  },
  ,
  {
    icon: <MdFeaturedPlayList size={20} />,
    text: "Tabela Rotasyonu",
    path: "#",
  },
  {
    icon: <BiSolidReport size={20} />,
    text: "Raporlar",
    path: "#",
    submenu: [
      {
        icon: "",
        text: "İntizam Cetveli",
        path: "#",
      },
      {
        icon: "",
        text: "Detay Raporu",
        path: "#",
      },
      {
        icon: "",
        text: "Araç Dağılımları",
        path: "#",
      },
    ],
  },
  {
    icon: <MdOutlineDescription size={20} />,
    text: "Tanımlar",
    path: "/tanimlar",
  },
  {
    icon: <MdBrowserUpdated size={20} />,
    text: "Veri Güncelleme",
    path: "#",
  },
  {
    icon: <FaFileArchive size={20} />,
    text: "Arşivden Getir",
    path: "#",
    submenu: [
      {
        icon: "",
        text: "Tarihliden",
        path: "#",
      },
      {
        icon: "",
        text: "Plandan",
        path: "#",
      },
    ],
  },
];
