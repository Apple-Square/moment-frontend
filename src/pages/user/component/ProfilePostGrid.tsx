import React from 'react';

type ProfilePostGridProps = {
    posts: string[]; // 선택된 데이터 배열
    selectedType: string; // 선택된 타입을 받음
};

export const ProfilePostGrid: React.FC<ProfilePostGridProps> = ({ posts, selectedType }) => {
    return (
        <div style={styles.grid}>
            {posts.map((post, index) => (
                <div key={index} style={styles.gridItem}>
                    {selectedType === 'videos' ? (
                        <video controls style={styles.media}>
                            <source src={post} type="video/mp4" />
                        </video>
                    ) : (
                        <img src={post} alt={`Post ${index}`} style={styles.media} />
                    )}
                </div>
            ))}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem',
        padding: '1rem',
    },
    gridItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    media: {
        width: '100%',
        height: 'auto',
    },
};
