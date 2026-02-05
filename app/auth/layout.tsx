export default function AuthLayout(props: { children: React.ReactNode }) {
    return <div className="flex relative min-h-screen w-full justify-center items-center overflow-hidden">
        {props.children}
    </div>;
}