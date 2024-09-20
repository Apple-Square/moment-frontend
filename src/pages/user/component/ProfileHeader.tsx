import React from 'react';

type ProfileHeaderProps = {
    username: string;
    name: string;
    bio: string;
    posts: number;
    followers: number;
    following: number;
    profilePicUrl: string;
    style?: React.CSSProperties;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, name, bio, posts, followers, following, profilePicUrl,style }) => {
    return (
        <div style={{ ...styles.profileHeader, ...style }}>
            <img src={profilePicUrl} alt="Profile" style={styles.profilePic} />
            <div>
                <h2>{username}</h2>
                <p>{name}</p>
                <p>{bio}</p>
                <div style={styles.stats}>
                    <p>{posts} posts</p>
                    <p>{followers} followers</p>
                    <p>{following} following</p>
                </div>
            </div>
        </div>
    );
};

const styles: {[key : string] : React.CSSProperties} = {
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
    },
    profilePic: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
    },
    stats: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem',
    }
};

