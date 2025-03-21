import React from "react";
import { Card, Button} from "antd";


export default function CompanyPage() {
  return (
    <div className="container mx-auto p-6">
      {/* Company Header */}
      <div className="bg-green-600 text-white p-6 rounded-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SonatGame Studio</h1>
          <p className="text-sm">https://www.sonat.vn/</p>
        </div>
        <Button className="bg-white text-green-600">+ Theo dõi công ty</Button>
      </div>
      
      {/* About Company */}
      <Card className="mt-6">
        
          <h2 className="text-xl font-bold">Giới thiệu công ty</h2>
          <p className="mt-2 text-gray-600">
            SonatGame Studio là công ty sản xuất game mobile toàn cầu - Top 1 Puzzle Game Việt Nam...
          </p>
   
      </Card>
      
      {/* Job Listings */}
      <Card className="mt-6">
       
          <h2 className="text-xl font-bold">Tuyển dụng</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              
                <h3 className="font-bold">Game Designer (Fresher)</h3>
                <p className="text-sm text-gray-500">Từ 8 triệu - Hà Nội</p>
                <Button className="mt-2 w-full">Ứng tuyển</Button>
             
            </Card>
            <Card>
              
                <h3 className="font-bold">Digital Marketing Intern</h3>
                <p className="text-sm text-gray-500">Từ 6-8 triệu - Hà Nội</p>
                <Button className="mt-2 w-full">Ứng tuyển</Button>
              
            </Card>
          </div>
       
      </Card>
    </div>
  );
}
