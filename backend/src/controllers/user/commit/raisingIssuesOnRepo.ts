import { Response } from 'express';
import prisma from '../../../db/db.config';
import { UserRequest } from '../../../types/userType';

export const raiseNewIssue = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(403).json({ message: 'User not found' });
    }

    const user = await prisma.user.findUnique({
        where: { email: req.user.email },
    });

    if (user) {
        const repo = await prisma.repository.findUnique({
            where: { id: parseInt(req.params.repoid), ownerId: user.id },
        });

        if (repo) {
            const newIssue = await prisma.issue.create({
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    creatorId: user.id,
                    repositoryId: parseInt(req.params.repoid),
                },
            });
            res.status(201).json({ message: 'Issue created', data: newIssue.title });
        } else {
            res.status(403).json({ message: 'Repository not found' });
        }
    } else {
        res.status(403).json({ message: 'User not found' });
    }
};
