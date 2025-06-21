const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/dashboard/analytics">Analytics</a></li>
                    <li><a href="/dashboard/products">Productos</a></li>
                    <li><a href="/dashboard/chatbot">Chatbot</a></li>
                    <li><a href="/dashboard/meta-config">Meta Config</a></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;