import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Journey from './pages/Journey'
import Navratri from './pages/Navratri'
import Programs from './pages/Programs'
import Gallery from './pages/Gallery'
import Videos from './pages/Videos'
import Committee from './pages/Committee'
import Community from './pages/Community'
import Volunteer from './pages/Volunteer'
import Contribute from './pages/Contribute'
import Contact from './pages/Contact'
import QRLanding from './pages/QRLanding'
import NotFound from './pages/NotFound'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminFestivalYears from './admin/AdminFestivalYears'
import AdminDailyPrograms from './admin/AdminDailyPrograms'
import AdminEvents from './admin/AdminEvents'
import AdminAnnouncements from './admin/AdminAnnouncements'
import AdminGallery from './admin/AdminGallery'
import AdminVideos from './admin/AdminVideos'
import AdminCommittee from './admin/AdminCommittee'
import AdminActivities from './admin/AdminActivities'
import AdminVolunteers from './admin/AdminVolunteers'
import AdminMessages from './admin/AdminMessages'
import AdminSettings from './admin/AdminSettings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="journey" element={<Journey />} />
        <Route path="navratri" element={<Navratri />} />
        <Route path="programs" element={<Programs />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="videos" element={<Videos />} />
        <Route path="committee" element={<Committee />} />
        <Route path="community" element={<Community />} />
        <Route path="volunteer" element={<Volunteer />} />
        <Route path="contribute" element={<Contribute />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="qr" element={<QRLanding />} />

      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="festival-years" element={<AdminFestivalYears />} />
        <Route path="daily-programs" element={<AdminDailyPrograms />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="videos" element={<AdminVideos />} />
        <Route path="committee" element={<AdminCommittee />} />
        <Route path="activities" element={<AdminActivities />} />
        <Route path="volunteers" element={<AdminVolunteers />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
