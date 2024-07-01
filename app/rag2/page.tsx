"use client";
import UserInput from "../components/UserInput";

export default function Page() {
    return (
        <>
            <div className="flex justify-center w-full sticky bottom-0 px-5 pt-5 bg-gradient-to-t from-background/90 to-transparent">
                <UserInput className="flex flex-col w-full max-w-screen-lg backdrop-blur-md rounded-b-none " />
            </div>
        </>
    );
}
