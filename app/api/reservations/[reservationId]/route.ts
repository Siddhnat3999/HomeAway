import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../../../actions/getCurrentUser";
import { NextResponse } from "next/server";

interface IParams {
  reservationId: string;
}

export async function DELETE(
  request: Request, 
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('Invalid ID');
  }

  // Delete the reservation for the current user
  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
    OR:[
      {userId: currentUser.id},
      {listing:{userId:currentUser.id}}
    
    ]
    },
  });

  // Return appropriate response
  return NextResponse.json(reservation);
}
