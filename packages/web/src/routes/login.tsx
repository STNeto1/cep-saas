export default function Login() {
  return (
    <main>
      <h1>Login</h1>
      <a href={`${import.meta.env.VITE_API_URL}/auth/google/authorize`}>
        Login with Google
      </a>
    </main>
  )
}
