import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Donation from "./pages/Donation";
import CreateFundraiser from "./pages/CreateFundraiser";
import ValidatorRegistration from "./pages/ValidatorRegistration";

import { Web3Provider } from './components/Web3Provider'
import FundraisersDetailPage from "./pages/FundraiserDetailPage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/donation" element={<Web3Provider><Donation /></Web3Provider>} />
      <Route path="/create-fundraiser" element={<Web3Provider><CreateFundraiser /></Web3Provider>} />
      <Route path="/validator-registration" element={<Web3Provider><ValidatorRegistration /></Web3Provider>} />
      <Route path="/fund/:id" element={<Web3Provider><FundraisersDetailPage /></Web3Provider>} />
    </Routes>
  )
}

export default App
