const AnimatedBackground = () => {
    return <div className="fixed inset-0 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background/5 to-primary/10"/>
    </div>
};

export default AnimatedBackground;
