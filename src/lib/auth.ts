import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Nodemailer from 'next-auth/providers/nodemailer'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.SMTP_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`\n======================================================`)
          console.log(`🔑 DEV LOGIN LINK FOR: ${identifier}`)
          console.log(`👉 ${url}`)
          console.log(`======================================================\n`)
          return
        }
        
        const { createTransport } = await import('nodemailer')
        const transport = createTransport(provider.server)
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to BNI Krypton`,
          text: `Sign in by clicking this link: ${url}`,
          html: `<body style="background: #f9f9f9; padding: 20px;">
                  <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px;">
                    <h2>Sign in to BNI Krypton</h2>
                    <p>Click the button below to sign in:</p>
                    <a href="${url}" style="display: inline-block; background: #B61F2B; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Sign In</a>
                  </div>
                 </body>`
        })
      }
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/login/verify',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Fetch role from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        })
        ;(session.user as typeof session.user & { role: string }).role = dbUser?.role ?? 'MEMBER'
      }
      return session
    },
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.AUTH_SECRET,
})
