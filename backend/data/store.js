// In-memory data store — replaces MongoDB
// Data persists only while the server is running (resets on restart)

import bcrypt from 'bcrypt';

// ============================================================
// Auto-incrementing ID generators
// ============================================================
let doctorIdCounter = 15;
let userIdCounter = 0;
let appointmentIdCounter = 0;

const generateDoctorId = () => `doc${++doctorIdCounter}`;
const generateUserId = () => `user${++userIdCounter}`;
const generateAppointmentId = () => `appt${++appointmentIdCounter}`;

// ============================================================
// Doctor image URLs (placeholder avatars)
// ============================================================
const docImages = {
    doc1: 'https://randomuser.me/api/portraits/men/1.jpg',
    doc2: 'https://randomuser.me/api/portraits/women/2.jpg',
    doc3: 'https://randomuser.me/api/portraits/women/3.jpg',
    doc4: 'https://randomuser.me/api/portraits/men/4.jpg',
    doc5: 'https://randomuser.me/api/portraits/women/5.jpg',
    doc6: 'https://randomuser.me/api/portraits/men/6.jpg',
    doc7: 'https://randomuser.me/api/portraits/men/7.jpg',
    doc8: 'https://randomuser.me/api/portraits/men/8.jpg',
    doc9: 'https://randomuser.me/api/portraits/women/9.jpg',
    doc10: 'https://randomuser.me/api/portraits/men/10.jpg',
    doc11: 'https://randomuser.me/api/portraits/women/11.jpg',
    doc12: 'https://randomuser.me/api/portraits/men/12.jpg',
    doc13: 'https://randomuser.me/api/portraits/women/13.jpg',
    doc14: 'https://randomuser.me/api/portraits/men/14.jpg',
    doc15: 'https://randomuser.me/api/portraits/women/15.jpg',
};

// ============================================================
// Pre-seeded Doctors (matches frontend assets.js)
// ============================================================
const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        email: 'richard@example.com',
        password: '$2b$10$dummyhashedpassword1', // placeholder
        image: docImages.doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        available: true,
        fees: 50,
        slots_booked: {},
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        email: 'emily@example.com',
        password: '$2b$10$dummyhashedpassword2',
        image: docImages.doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Larson specializes in women\'s health with a focus on comprehensive gynecological care, preventive screenings, and patient-centered treatment approaches.',
        available: true,
        fees: 60,
        slots_booked: {},
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        email: 'sarah@example.com',
        password: '$2b$10$dummyhashedpassword3',
        image: docImages.doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Patel is dedicated to providing expert dermatological care, specializing in skin health, cosmetic treatments, and early detection of skin conditions.',
        available: true,
        fees: 30,
        slots_booked: {},
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        email: 'christopher@example.com',
        password: '$2b$10$dummyhashedpassword4',
        image: docImages.doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Lee is passionate about child healthcare, offering compassionate pediatric services from newborn care to adolescent medicine.',
        available: true,
        fees: 40,
        slots_booked: {},
        address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        email: 'jennifer@example.com',
        password: '$2b$10$dummyhashedpassword5',
        image: docImages.doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Garcia brings expertise in neurological disorders, providing thorough diagnostic evaluations and personalized treatment plans for brain and nervous system conditions.',
        available: true,
        fees: 50,
        slots_booked: {},
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        email: 'andrew@example.com',
        password: '$2b$10$dummyhashedpassword6',
        image: docImages.doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Williams specializes in complex neurological cases with a focus on innovative treatments and patient rehabilitation for optimal outcomes.',
        available: true,
        fees: 50,
        slots_booked: {},
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        email: 'chris.davis@example.com',
        password: '$2b$10$dummyhashedpassword7',
        image: docImages.doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        available: true,
        fees: 50,
        slots_booked: {},
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        email: 'timothy@example.com',
        password: '$2b$10$dummyhashedpassword8',
        image: docImages.doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. White provides comprehensive women\'s health services with a patient-first approach, specializing in prenatal care and gynecological wellness.',
        available: true,
        fees: 60,
        slots_booked: {},
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        email: 'ava@example.com',
        password: '$2b$10$dummyhashedpassword9',
        image: docImages.doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Mitchell combines cutting-edge dermatological techniques with personalized patient care for all skin types and conditions.',
        available: true,
        fees: 30,
        slots_booked: {},
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        email: 'jeffrey@example.com',
        password: '$2b$10$dummyhashedpassword10',
        image: docImages.doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. King is committed to providing the highest quality of pediatric care with a warm, family-friendly approach to children\'s health.',
        available: true,
        fees: 40,
        slots_booked: {},
        address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        email: 'zoe@example.com',
        password: '$2b$10$dummyhashedpassword11',
        image: docImages.doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Kelly focuses on neurological health with expertise in migraine management, epilepsy treatment, and neurodegenerative disease care.',
        available: true,
        fees: 50,
        slots_booked: {},
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        email: 'patrick@example.com',
        password: '$2b$10$dummyhashedpassword12',
        image: docImages.doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Harris delivers expert neurological care with a focus on evidence-based treatments and compassionate patient support.',
        available: true,
        fees: 50,
        slots_booked: {},
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        email: 'chloe@example.com',
        password: '$2b$10$dummyhashedpassword13',
        image: docImages.doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Evans provides holistic primary care with emphasis on wellness, preventive health, and managing chronic conditions effectively.',
        available: true,
        fees: 50,
        slots_booked: {},
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        email: 'ryan@example.com',
        password: '$2b$10$dummyhashedpassword14',
        image: docImages.doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Martinez is dedicated to advancing women\'s health through innovative treatments, supportive care, and patient education.',
        available: true,
        fees: 60,
        slots_booked: {},
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        email: 'amelia@example.com',
        password: '$2b$10$dummyhashedpassword15',
        image: docImages.doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Hill offers comprehensive skincare solutions with expertise in both medical and cosmetic dermatology for all age groups.',
        available: true,
        fees: 30,
        slots_booked: {},
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
        date: Date.now(),
    },
];

// ============================================================
// Users Store
// ============================================================
const users = [];

// Default user image (base64 placeholder)
const defaultUserImage = 'https://randomuser.me/api/portraits/lego/1.jpg';

// ============================================================
// Appointments Store
// ============================================================
const appointments = [];

// ============================================================
// Store API — mimics Mongoose-style operations
// ============================================================
const store = {
    // --- Doctors ---
    doctors: {
        find: (filter = {}) => {
            let result = [...doctors];
            if (filter.docId) result = result.filter(d => d._id === filter.docId);
            return result;
        },
        findById: (id) => {
            const doc = doctors.find(d => d._id === id);
            return doc ? { ...doc } : null;
        },
        findOne: (filter) => {
            const doc = doctors.find(d => {
                return Object.keys(filter).every(key => d[key] === filter[key]);
            });
            return doc ? { ...doc } : null;
        },
        save: (doctorData) => {
            const id = generateDoctorId();
            const doctor = { _id: id, ...doctorData };
            doctors.push(doctor);
            return { ...doctor };
        },
        updateById: (id, updates) => {
            const index = doctors.findIndex(d => d._id === id);
            if (index !== -1) {
                doctors[index] = { ...doctors[index], ...updates };
                return { ...doctors[index] };
            }
            return null;
        },
        selectWithout: (fields = []) => {
            return doctors.map(d => {
                const copy = { ...d };
                fields.forEach(f => delete copy[f]);
                return copy;
            });
        },
    },

    // --- Users ---
    users: {
        find: (filter = {}) => {
            let result = [...users];
            if (filter.userId) result = result.filter(u => u._id === filter.userId);
            return result;
        },
        findById: (id) => {
            const user = users.find(u => u._id === id);
            return user ? { ...user } : null;
        },
        findOne: (filter) => {
            const user = users.find(u => {
                return Object.keys(filter).every(key => u[key] === filter[key]);
            });
            return user ? { ...user } : null;
        },
        save: (userData) => {
            const id = generateUserId();
            const user = {
                _id: id,
                image: defaultUserImage,
                phone: '000000000',
                address: { line1: '', line2: '' },
                gender: 'Not Selected',
                dob: 'Not Selected',
                ...userData,
            };
            users.push(user);
            return { ...user };
        },
        updateById: (id, updates) => {
            const index = users.findIndex(u => u._id === id);
            if (index !== -1) {
                users[index] = { ...users[index], ...updates };
                return { ...users[index] };
            }
            return null;
        },
    },

    // --- Appointments ---
    appointments: {
        find: (filter = {}) => {
            let result = [...appointments];
            Object.keys(filter).forEach(key => {
                result = result.filter(a => a[key] === filter[key]);
            });
            return result;
        },
        findById: (id) => {
            const appt = appointments.find(a => a._id === id);
            return appt ? { ...appt } : null;
        },
        save: (appointmentData) => {
            const id = generateAppointmentId();
            const appointment = { _id: id, ...appointmentData };
            appointments.push(appointment);
            return { ...appointment };
        },
        updateById: (id, updates) => {
            const index = appointments.findIndex(a => a._id === id);
            if (index !== -1) {
                appointments[index] = { ...appointments[index], ...updates };
                return { ...appointments[index] };
            }
            return null;
        },
    },
};

export default store;
