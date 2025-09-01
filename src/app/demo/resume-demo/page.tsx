"use client";

import React from "react";

const ResumeDemoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 z-10">
      <div className="max-w-4xl p-4 mx-auto bg-white shadow-lg">
        {/* 简历主体 */}
        <div className="grid grid-cols-5 min-h-[297mm] border-2 border-gray-300">
          <div className="col-span-5 p-8 bg-white flex justify-between border-b border-gray-300">
            {/* 姓名和职位 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">
                RICHARD SANCHEZ
              </h1>
              <div className="bg-black text-white px-4 py-2 inline-block">
                <span className="text-sm font-medium tracking-wider">
                  WEB DEVELOPER
                </span>
              </div>
            </div>

            {/* 头像 */}
            <div className="flex justify-end mb-8">
              <div className="w-24 h-24 rounded-full border-2 border-black overflow-hidden bg-gray-200 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>
          </div>
          {/* 左侧栏 - 个人信息 */}
          <div className="col-span-2 p-8 bg-white border-r border-gray-300">
            {/* 个人简介 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black border-b border-black pb-2 mb-4">
                PROFILE
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Experienced web developer with five years of expertise in
                database administration and website design. Creative and
                analytical team player with a keen eye for detail and strong
                problem-solving abilities. Passionate about creating efficient,
                user-friendly digital solutions.
              </p>
            </div>

            {/* 工作经验 */}
            <div>
              <h2 className="text-lg font-bold text-black border-b border-black pb-2 mb-4">
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {/* 工作经历 1 */}
                <div>
                  <h3 className="font-bold text-black text-sm mb-1">
                    APPLICATIONS DEVELOPER
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Really Great Company
                  </p>
                  <p className="text-sm text-gray-500 mb-2">2016 - Present</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Database administration and website design</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Built the logic for a streamlined ad-serving platform
                        that scaled
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Educational institutions and online classroom management
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 工作经历 2 */}
                <div>
                  <h3 className="font-bold text-black text-sm mb-1">
                    WEB CONTENT MANAGER
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Really Great Company
                  </p>
                  <p className="text-sm text-gray-500 mb-2">2014 - 2016</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Database administration and website design</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Built the logic for a streamlined ad-serving platform
                        that scaled
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Educational institutions and online classroom management
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 工作经历 3 */}
                <div>
                  <h3 className="font-bold text-black text-sm mb-1">
                    ANALYSIS CONTENT
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Really Great Company
                  </p>
                  <p className="text-sm text-gray-500 mb-2">2010 - 2014</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Database administration and website design</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Built the logic for a streamlined ad-serving platform
                        that scaled
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Educational institutions and online classroom management
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧栏 - 教育、技能和联系方式 */}
          <div className="col-span-3 bg-white flex flex-col">
            {/* 教育经历 */}
            <div className="mb-8 p-8 flex-1">
              <h2 className="text-lg font-bold text-black border-b border-black pb-2 mb-4">
                EDUCATION
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-black text-sm mb-1">
                    SECONDARY SCHOOL
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Really Great High School
                  </p>
                  <p className="text-sm text-gray-500">2010 - 2014</p>
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm mb-1">
                    BACHELOR OF TECHNOLOGY
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Really Great University
                  </p>
                  <p className="text-sm text-gray-500">2014 - 2016</p>
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm mb-1">
                    MASTER OF TECHNOLOGY
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Really Great University
                  </p>
                  <p className="text-sm text-gray-500">2014 - 2016</p>
                </div>
              </div>
            </div>

            {/* 技能 */}
            <div className="mb-8 p-8 flex-1">
              <h2 className="text-lg font-bold text-black border-b border-black pb-2 mb-4">
                SKILLS
              </h2>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Web Design</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Design Thinking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Wireframe Creation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Front End Coding</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Problem-Solving</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Computer Literacy</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Project Management Tools</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Strong Communication</span>
                </li>
              </ul>
            </div>

            {/* 联系方式 */}
            <div className="bg-gray-800 text-white p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-white">📞</span>
                  <span className="text-sm">123-456-7890</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-white">✉️</span>
                  <span className="text-sm">hello@reallygreatsite.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-white">📍</span>
                  <span className="text-sm">
                    123 Anywhere St., Any City, ST 12345
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-white">🌐</span>
                  <span className="text-sm">www.reallygreatsite.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDemoPage;
