'use client';

import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';

export default function UserGrid() {
    const users = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        avatar: createAvatar(personas, {
            seed: `user-${i + 1}`,
            size: 128,
        }).toDataUri(),
    }));

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {users.map((user) => (
                <div key={user.id} className="flex flex-col items-center">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-24 h-24 rounded-full"
                    />
                    <span className="mt-2">{user.name}</span>
                </div>
            ))}
        </div>
    );
}