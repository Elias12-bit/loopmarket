import React from "react";
import ProductCard from "../components/ProductCard";

import team1 from "../assets/team1.jpg";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";
import team4 from "../assets/team4.jpg";
import team5 from "../assets/team5.jpg";
import team6 from "../assets/team6.jpg";
import team7 from "../assets/team7.jpg";
import team8 from "../assets/team8.jpg";
import team9 from "../assets/team9.jpg";

const Team = () => {
  const teamMembers = [
    {
      image: team1,
      title: "John Doe",
      description: "CEO & Founder. Passionate about technology and innovation.",
    },
    {
      image: team3,
      title: "Jane Smith",
      description: "Lead Developer. Expert in software and hardware solutions.",
    },
    {
      image: team2,
      title: "Mike Brown",
      description:
        "Customer Support Manager. Dedicated to providing the best service.",
    },
    {
      image: team4,
      title: "Sarah Johnson",
      description:
        "Marketing Manager. Expert in digital marketing and brand growth strategies.",
    },
    {
      image: team5,
      title: "David Lee",
      description:
        "Hardware Specialist. Passionate about laptop builds, testing, and performance optimization.",
    },
    {
      image: team6,
      title: "Emma Garcia",
      description:
        "Sales Executive. Dedicated to helping customers find the perfect laptop for their needs.",
    },
    {
      image: team7,
      title: "Chris Walker",
      description:
        "IT Technician. Skilled in troubleshooting and providing fast technical support.",
    },
    {
      image: team8,
      title: "Sophia Miller",
      description:
        "Customer Experience Lead. Ensures every client enjoys a smooth buying journey.",
    },
    {
      image: team9,
      title: "James Anderson",
      description:
        "Web Designer. Creates beautiful and user-friendly designs for our online store.",
        age:23
    },
  ];

  return (
    <section id="team" className="team">
      <h2>Our Team</h2>
      <div className="team-cards">
        {teamMembers.map((member, index) => (
          <ProductCard
            key={index}
            image={member.image}
            title={member.title}
            description={member.description}
            age={member.age}
          />
        ))}
      </div>
    </section>
  );
};

export default Team;
