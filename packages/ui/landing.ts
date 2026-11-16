import type { AppLocale } from "./locale";

interface LandingMessages {
  title: string;
  badge: string;
  description: string;
  language: string;
  navigation: string;
  vue: string;
  react: string;
  note: string;
}

export const landingMessages = {
  en: {
    title: "EduPro — School management in Vue & React",
    badge: "Frontend portfolio",
    description:
      "One school, two implementations. Explore courses, subjects, students and enrollments with the same experience in Vue and React.",
    language: "Language",
    navigation: "Choose a version",
    vue: "Explore Vue",
    react: "Explore React",
    note: "Fictional data and local storage. Both versions share your changes in this browser. No emails are sent.",
  },
  "pt-BR": {
    title: "EduPro — Gestão escolar em Vue e React",
    badge: "Portfólio frontend",
    description:
      "Uma escola, duas implementações. Explore cursos, disciplinas, alunos e matrículas com a mesma experiência em Vue e React.",
    language: "Idioma",
    navigation: "Escolher versão",
    vue: "Explorar em Vue",
    react: "Explorar em React",
    note: "Dados fictícios e persistência local. As duas versões compartilham suas alterações neste navegador. Nenhum e-mail é enviado.",
  },
  es: {
    title: "EduPro — Gestión escolar en Vue y React",
    badge: "Portafolio frontend",
    description:
      "Una escuela, dos implementaciones. Explora cursos, asignaturas, alumnos y matrículas con la misma experiencia en Vue y React.",
    language: "Idioma",
    navigation: "Elegir versión",
    vue: "Explorar en Vue",
    react: "Explorar en React",
    note: "Datos ficticios y almacenamiento local. Ambas versiones comparten tus cambios en este navegador. No se envían correos electrónicos.",
  },
} satisfies Record<AppLocale, LandingMessages>;
