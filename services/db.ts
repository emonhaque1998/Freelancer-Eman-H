
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { Project, User, UserRole, ContactMessage, Review, Service, ServiceInquiry, InquiryStatus, InquiryMessage, AboutData } from '../types';
import { MOCK_ADMIN, INITIAL_PROJECTS } from '../constants';

// Professional UploadThing Configuration using Environment Variables
export const UPLOADTHING_CONFIG = {
  appId: process.env.UPLOADTHING_APP_ID || 'qgsvrkvunn',
  secret: process.env.UPLOADTHING_SECRET || '',
  baseCdn: 'https://utfs.io/f/'
};

const firebaseConfig = {
  apiKey: "AIzaSyC3DmWMnCdzoIkdkHuJc31FqtKTM_hnxVQ",
  authDomain: "emanhaque-14a71.firebaseapp.com",
  projectId: "emanhaque-14a71",
  storageBucket: "emanhaque-14a71.firebasestorage.app",
  messagingSenderId: "217807667705",
  appId: "1:217807667705:web:a29a516b4954a20992bd28",
  measurementId: "G-E6LQ19RTKR"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

class FirebaseDB {
  private isInitialized = false;

  constructor() {
    this.setupDefaults();
  }

  private async setupDefaults() {
    try {
      const adminDoc = await getDoc(doc(firestore, 'users', MOCK_ADMIN.id));
      if (!adminDoc.exists()) {
        await setDoc(doc(firestore, 'users', MOCK_ADMIN.id), {
          ...MOCK_ADMIN,
          avatar: `${UPLOADTHING_CONFIG.baseCdn}placeholder-user.png`,
          createdAt: Timestamp.now()
        });
      }

      const aboutDoc = await getDoc(doc(firestore, 'about_me', 'me'));
      if (!aboutDoc.exists()) {
        const defaultAbout: AboutData = {
          id: 'me',
          name: 'Eman Haque',
          title: 'Laravel, WordPress & Full-Stack Developer',
          overview: 'Expert web development specialized in Laravel framework, WordPress CMS, and high-performance custom applications.',
          bio: 'I am a passionate B.Sc Graduate in Computer Science specialized in building high-conversion WordPress websites and scalable Laravel enterprise solutions.',
          vision: 'Empowering businesses with modern, SEO-optimized, and lightning-fast web technologies.',
          skills: ['Laravel', 'WordPress', 'React', 'Node.js', 'PHP', 'Custom Web Development'],
          values: ['SEO Optimization', 'Clean Architecture', 'Client Satisfaction'],
          experience_years: '2+',
          projects_count: '25+',
          education: 'B.Sc in Computer Science & Engineering',
          location: 'Dhaka, Bangladesh',
          email: 'admin@devport.com',
          imageUrl: `${UPLOADTHING_CONFIG.baseCdn}placeholder-profile.png`,
          workspaceImageUrl: `${UPLOADTHING_CONFIG.baseCdn}placeholder-workspace.png`,
          hardwareImageUrl: `${UPLOADTHING_CONFIG.baseCdn}placeholder-hardware.png`,
          faviconUrl: `${UPLOADTHING_CONFIG.baseCdn}placeholder-favicon.png`,
          seoThumbnailUrl: `${UPLOADTHING_CONFIG.baseCdn}placeholder-project.png`,
          googleConsoleToken: '',
          googleCustomHtml: ''
        };
        await setDoc(doc(firestore, 'about_me', 'me'), defaultAbout);
      }

      const projectCheck = await getDocs(query(collection(firestore, 'projects'), limit(1)));
      if (projectCheck.empty) {
        for (const p of INITIAL_PROJECTS) {
          await setDoc(doc(firestore, 'projects', p.id), {
            ...p,
            imageUrl: `${UPLOADTHING_CONFIG.baseCdn}placeholder-project.png`,
            createdAt: Timestamp.now()
          });
        }
      }

      const serviceCheck = await getDocs(query(collection(firestore, 'services'), limit(1)));
      if (serviceCheck.empty) {
        const defaultServices: Service[] = [
          {
            id: 'wp-service',
            title: 'WordPress Development',
            description: 'Custom theme and plugin development optimized for speed, security, and SEO.',
            price: 'Starts at $299',
            icon: '🎨',
            features: ['Custom Themes', 'Plugin Development', 'SEO Optimization', 'Speed Tuning']
          },
          {
            id: 'laravel-service',
            title: 'Laravel Solutions',
            description: 'Scalable and secure enterprise-grade applications built with the Laravel framework.',
            price: 'Starts at $499',
            icon: '💎',
            features: ['API Development', 'Custom CRM/SaaS', 'Database Design', 'Secure Logic']
          },
          {
            id: 'web-dev-service',
            title: 'Full Stack Development',
            description: 'Modern, responsive web applications using the latest JavaScript frameworks and Node.js.',
            price: 'Starts at $399',
            icon: '🚀',
            features: ['React Applications', 'Node.js Backend', 'Responsive Design', 'Cloud Deployment']
          }
        ];
        for (const s of defaultServices) {
          await setDoc(doc(firestore, 'services', s.id), s);
        }
      }

      this.isInitialized = true;
    } catch (e) {
      console.error("Firebase Initialization Error:", e);
    }
  }

  async getAbout(): Promise<AboutData> {
    const snap = await getDoc(doc(firestore, 'about_me', 'me'));
    if (!snap.exists()) throw new Error("About data missing");
    return snap.data() as AboutData;
  }

  async updateAbout(data: AboutData) {
    await setDoc(doc(firestore, 'about_me', 'me'), data);
  }

  async getUsers(): Promise<User[]> {
    const snap = await getDocs(query(collection(firestore, 'users'), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ 
      ...d.data(), 
      id: d.id,
      createdAt: d.data().createdAt instanceof Timestamp ? d.data().createdAt.toDate().toISOString() : d.data().createdAt 
    } as User));
  }

  async addUser(user: User) {
    await setDoc(doc(firestore, 'users', user.id), { ...user, createdAt: Timestamp.now() });
  }

  async updateUser(user: Partial<User> & { id: string }) {
    const userRef = doc(firestore, 'users', user.id);
    await updateDoc(userRef, user as any);
  }

  async updateUserRole(id: string, role: UserRole) {
    await updateDoc(doc(firestore, 'users', id), { role });
  }

  async deleteUser(id: string) {
    await deleteDoc(doc(firestore, 'users', id));
  }

  async getProjects(): Promise<Project[]> {
    const snap = await getDocs(query(collection(firestore, 'projects'), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => {
      const data = d.data();
      return { 
        ...data, 
        id: d.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt 
      } as Project;
    });
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      const docRef = doc(firestore, 'projects', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return { 
          ...data, 
          id: snap.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt 
        } as Project;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  async saveProject(project: Project) {
    const projectRef = doc(firestore, 'projects', project.id);
    await setDoc(projectRef, {
      ...project,
      createdAt: project.createdAt ? Timestamp.fromDate(new Date(project.createdAt)) : Timestamp.now()
    });
  }

  async deleteProject(id: string) {
    await deleteDoc(doc(firestore, 'projects', id));
  }

  async getServices(): Promise<Service[]> {
    const snap = await getDocs(collection(firestore, 'services'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Service));
  }

  async saveService(service: Service) {
    await setDoc(doc(firestore, 'services', service.id), service);
  }

  async deleteService(id: string) {
    await deleteDoc(doc(firestore, 'services', id));
  }

  async addServiceInquiry(inquiry: ServiceInquiry) {
    await setDoc(doc(firestore, 'service_inquiries', inquiry.id), { ...inquiry, createdAt: Timestamp.now() });
  }

  async deleteInquiry(id: string) {
    await deleteDoc(doc(firestore, 'service_inquiries', id));
  }

  async getServiceInquiries(): Promise<ServiceInquiry[]> {
    const snap = await getDocs(query(collection(firestore, 'service_inquiries'), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({
      ...d.data(),
      id: d.id,
      createdAt: d.data().createdAt instanceof Timestamp ? d.data().createdAt.toDate().toISOString() : d.data().createdAt
    } as ServiceInquiry));
  }

  async getServiceInquiriesByClient(clientId: string): Promise<ServiceInquiry[]> {
    const q = query(collection(firestore, 'service_inquiries'), where('clientId', '==', clientId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      ...d.data(),
      id: d.id,
      createdAt: d.data().createdAt instanceof Timestamp ? d.data().createdAt.toDate().toISOString() : d.data().createdAt
    } as ServiceInquiry)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateServiceInquiryStatus(id: string, status: InquiryStatus) {
    await updateDoc(doc(firestore, 'service_inquiries', id), { status });
  }

  async getReviewsByProject(projectId: string): Promise<Review[]> {
    const q = query(collection(firestore, 'reviews'), where('projectId', '==', projectId));
    try {
      const snap = await getDocs(q);
      return snap.docs.map(d => ({
        ...d.data(),
        id: d.id,
        createdAt: d.data().createdAt instanceof Timestamp ? d.data().createdAt.toDate().toISOString() : d.data().createdAt
      } as Review)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      return [];
    }
  }

  async addReview(review: Review) {
    await setDoc(doc(firestore, 'reviews', review.id), { ...review, createdAt: Timestamp.now() });
  }

  async saveMessage(msg: ContactMessage) {
    await setDoc(doc(firestore, 'messages', msg.id), { ...msg, date: Timestamp.now() });
  }

  async deleteMessage(id: string) {
    await deleteDoc(doc(firestore, 'messages', id));
  }
  
  async getMessages(): Promise<ContactMessage[]> {
    const snap = await getDocs(query(collection(firestore, 'messages'), orderBy('date', 'desc')));
    return snap.docs.map(d => ({
      ...d.data(),
      id: d.id,
      date: d.data().date instanceof Timestamp ? d.data().date.toDate().toISOString() : d.data().date
    } as ContactMessage));
  }

  async getInquiryMessages(inquiryId: string): Promise<InquiryMessage[]> {
    const q = query(collection(firestore, 'inquiry_messages'), where('inquiryId', '==', inquiryId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      ...d.data(),
      id: d.id,
      createdAt: d.data().createdAt instanceof Timestamp ? d.data().createdAt.toDate().toISOString() : d.data().createdAt
    } as InquiryMessage)).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async addInquiryMessage(msg: InquiryMessage) {
    await setDoc(doc(firestore, 'inquiry_messages', msg.id), { ...msg, createdAt: Timestamp.now() });
  }
}

export const db = new FirebaseDB();
