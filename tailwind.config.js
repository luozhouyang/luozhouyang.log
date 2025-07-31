/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            fontSize: '16px',
            lineHeight: '1.5',
            color: 'rgb(var(--gray-dark))',
            p: {
              marginTop: '1em',
              marginBottom: '1em',
              lineHeight: '1.5',
            },
            '[class~="lead"]': {
              color: 'rgb(var(--gray-dark))',
              fontSize: '1.1em',
              lineHeight: '1.5',
            },
            a: {
              color: 'var(--accent)',
              '&:hover': {
                color: 'var(--accent-dark)',
              },
            },
            strong: {
              color: 'rgb(var(--black))',
              fontWeight: '700',
            },
            'ol > li': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
              paddingLeft: '0.5em',
              '&::marker': {
                fontWeight: '600',
                color: 'var(--tw-prose-counters)'
              }
            },
            'ul > li': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
              paddingLeft: '0.5em',
              '&::marker': {
                color: 'var(--tw-prose-bullets)'
              }
            },
            h1: {
              color: 'rgb(var(--black))',
              fontSize: '2.25em',
              marginTop: '1.5em',
              marginBottom: '0.8em',
              lineHeight: '1.2',
            },
            h2: {
              color: 'rgb(var(--black))',
              fontSize: '1.75em',
              marginTop: '1.5em',
              marginBottom: '0.8em',
              lineHeight: '1.2',
            },
            h3: {
              color: 'rgb(var(--black))',
              fontSize: '1.5em',
              marginTop: '1.5em',
              marginBottom: '0.8em',
              lineHeight: '1.2',
            },
            h4: {
              color: 'rgb(var(--black))',
              fontSize: '1.25em',
              marginTop: '1.5em',
              marginBottom: '0.8em',
              lineHeight: '1.2',
            },
            code: {
              color: 'rgb(var(--black))',
              fontSize: '0.9em',
            },
            blockquote: {
              color: 'rgb(var(--gray-dark))',
              fontSize: '1em',
              lineHeight: '1.5',
            },
            table: {
              fontSize: '0.9em',
            },
            'th, td': {
              padding: '0.5em 0.5em 0.5em 1.5em',
            },
            thead: {
              borderBottomColor: 'rgb(var(--gray-light))',
            },
            'thead th': {
              color: 'rgb(var(--black))',
              fontWeight: '700',
              borderBottom: '1px solid rgb(var(--gray-light))',
              backgroundColor: 'rgb(var(--gray-light))',
            },
            'tbody tr': {
              borderBottomColor: 'rgb(var(--gray-light))',
            },
            'tbody td': {
              color: 'rgb(var(--gray-dark))',
            },
            '.dark &': {
              color: 'hsl(var(--foreground))',
              p: {
                color: 'hsl(var(--foreground))',
              },
              '[class~="lead"]': {
                color: 'hsl(var(--foreground))',
              },
              a: {
                color: 'hsl(var(--primary))',
                '&:hover': {
                  color: 'hsl(var(--primary) / 0.8)',
                },
              },
              strong: {
                color: 'hsl(var(--primary))',
              },
              h1: {
                color: 'hsl(var(--primary))',
              },
              h2: {
                color: 'hsl(var(--primary))',
              },
              h3: {
                color: 'hsl(var(--primary))',
              },
              h4: {
                color: 'hsl(var(--primary))',
              },
              code: {
                color: 'hsl(var(--primary))',
                backgroundColor: 'hsl(var(--muted))',
              },
              blockquote: {
                color: 'hsl(var(--foreground))',
                borderLeftColor: 'hsl(var(--primary))',
              },
              'thead th': {
                color: 'hsl(var(--primary))',
                borderBottomColor: 'hsl(var(--border))',
                backgroundColor: 'hsl(var(--muted))',
              },
              'tbody tr': {
                borderBottomColor: 'hsl(var(--border))',
              },
              'tbody td': {
                color: 'hsl(var(--foreground))',
              },
              'ol > li::marker': {
                color: 'hsl(var(--foreground))',
              },
              'ul > li::marker': {
                color: 'hsl(var(--foreground))',
              },
            },
          }
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}