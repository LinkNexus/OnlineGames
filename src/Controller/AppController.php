<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[IsGranted('ROLE_USER')]
class AppController extends AbstractController
{
    #[Route('/app', name: 'app_app')]
    public function index(SerializerInterface $serializer): Response
    {
        $user = $serializer->serialize($this->getUser(), 'json', ['groups' => 'public']);
        return $this->render('app/index.html.twig', [
            'user' => $user
        ]);
    }

    #[Route('/publish', name: 'app_publish', methods: ['POST'])]
    public function publish(HubInterface $hub): Response
    {
        $hub->publish(
            new Update(
                'http://localhost:5001/test',
                json_encode(['status' => 'Mercure is functioning!'])
            )
        );

        return $this->redirectToRoute('app_app');
    }

    #[Route('/api/join', methods: ['POST'])]
    public function notifyParticipation(HubInterface $hub, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $hub->publish(
            new Update(
                'http://localhost:5001/join',
                json_encode([
                    'message' => 'A new player joined the game!',
                    'player' => $data
                ])
            )
        );

        return new JsonResponse();
    }

    #[Route('/api/choose-players', methods: ['POST'])]
    public function choosePlayers(HubInterface $hub, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $player1 = $data[0];
        $player2 = $data[1];

        $hub->publish(
            new Update(
                'http://localhost:5001/choose-players',
                json_encode([
                    'first-player' => $player1,
                    'second-player' => $player2
                ])
            )
        );

        return new JsonResponse();
    }
}


