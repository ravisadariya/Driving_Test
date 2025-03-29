const UserType = {
    EXAMINER: {
        id: '0',
        value: 'examiner',
        display: 'Examiner',
        permissions: [
            {href: 'examiner', display: 'Examiner'}
        ]
    },
    DRIVER: {
        id: '1',
        value: 'driver',
        display: 'Driver',
        permissions: [
            {href: 'g2', display: 'G2_Test'},
            {href: 'g', display: 'G_Test'},
        ]
    },
    ADMIN: {
        id: '2',
        value: 'admin',
        display: 'Admin',
        permissions: [
            {href: 'appointment', display: 'Appointment'}
        ]
    }
};

function getUserType(identifier) {
    const enumEntry = Object.values(UserType).find(entry =>
        entry.id === identifier || entry.value === identifier
    );

    return enumEntry || UserType.DRIVER;
}

function getUserTypes() {
    return UserType;
}

module.exports = {getUserType, getUserTypes}