export const publicRoutes = {
    home: '/',
    buildDetails: (id) => `/builds/${id}`,
    login: '/login',
    register: '/register',
    about: "/about",
    userBuilds: (id) => `/users/${id}`,
    notFound: '*'
}

export const protectedRoutes = {
    createBuild: '/builds/new',
    editBuild: (id) => `/builds/edit/${id}`,
    profile: '/profile'
}