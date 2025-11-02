import React from "react";
import {
  Html,
  Head,
  Body,
  Text,
  Container,
  Heading,
  Hr,
} from "@react-email/components";

interface Props {
  totalChanges?: number;
  date: string;
}

const DailyRBACReportEmail: React.FC<Props> = ({ totalChanges = 0, date }) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          background: "#f8f9fa",
          padding: "20px",
        }}
      >
        <Container
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Heading style={{ color: "#0d6efd" }}>
            Daily RBAC Change Report
          </Heading>
          <Text>Date: {date}</Text>
          <Hr />
          {totalChanges > 0 ? (
            <Text>
              <b>{totalChanges}</b> RBAC changes were detected in the last 24
              hours. The detailed report is attached as a PDF for your review.
            </Text>
          ) : (
            <Text>No RBAC changes were detected today.</Text>
          )}
          <Hr />
          <Text style={{ color: "#6c757d", fontSize: "12px" }}>
            This is an automated message from the Optical Shop Management
            System.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default DailyRBACReportEmail;
