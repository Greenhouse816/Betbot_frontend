/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "blue-1": "#2E90FA",
        'grey-2': '#EAECF0',
        "pink-1": '#F2F4F7',
        "pink-2": "#FEE4E2",
        "green-2": "#D1FADF",
        "green-3": "#32D583",
        "grey-4": "#F9FAFB",
        'purple-1': '#717BBC',
        'red-4': '#F04438',
        'yellow-2': '#FDB022',
        'mark1': '#FFFAEB'
      },
      textColor: {
        "black-1": "#344054",
        "black-2": "#101828",
        "blue-1": "#2E90FA",
        "grey-1": "#98A2B3",
        "grey-2": "#667085",
        "grey-3": "#3E4784",
        "green-1": "#054F31",
        "green-2": "#32D583",
        "green-3": "#039855",
        "pink-2": "#FEE4E2",
        "red-1": "#D92D20",
        "red-2": "#7A271A",
        "red-3": "#F97066",
        "yellow-1": "#DC6803",
        "link": "#1570EF"
      },
      borderColor: {
        "blue-1": "#2E90FA",
        'grey-2': '#EAECF0',
        'grey-1': '#D0D5DD',
      },
      gridTemplateColumns: {
        '14': 'repeat(14, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
      }
    },
    textShadow: {
      sm: '0px 0px 4px var(--tw-shadow-color)',
      DEFAULT: '2px 2px 4px var(--tw-shadow-color)',
      lg: '4px 4px 8px var(--tw-shadow-color)',
      xl: '4px 4px 16px var(--tw-shadow-color)',
    }
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    })
  ],
})

