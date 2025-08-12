<template> 
    <header>
        <nav class="navbar">
            <div class="logo">KPL</div>
            <ul class="nav-items">
                <li><a href="#home">Home</a></li>
                <li><a href="#teams">Teams</a></li>
                <li><a href="#schedule">Schedule</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>
</template>
<script setups></script>

<style scoped>
header {
background:#d32f2f;
color: #fff; 
padding: 0;
}
.navbar {
display: flex; align-items: center; justify-content: space-between;
padding: 1rem 2rem;
}
.logo {
font-size: 2rem; font-weight: bold; letter-spacing: 2px;
}
.nav-items {
list-style: none;
display: flex;
gap: 2rem; margin: 0; padding: 0;
}
.nav-items li a { color: #fff;
text-decoration: none; font-size: 1.1rem;
transition: color 0.2s;
}
•nav-items li a:hover { color:
口#ffC107;
}
</style>