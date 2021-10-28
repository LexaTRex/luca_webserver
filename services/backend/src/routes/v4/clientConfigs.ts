import { Request, Response, Router } from 'express';

import { FeatureFlag } from 'database';
import { requireHealthDepartmentEmployee } from 'middlewares/requireUser';

const router = Router();

function getClientConfigRoute(
  clientName:
    | 'locationFrontend'
    | 'healthDepartmentFrontend'
    | 'webapp'
    | 'ios'
    | 'android'
    | 'operatorApp'
) {
  return async (request: Request, response: Response) => {
    const flags = await FeatureFlag.findAll({
      where: { [clientName]: true },
    });

    const clientConfig: Record<string, string> = {};
    for (const flag of flags) {
      clientConfig[flag.key] = JSON.parse(flag.value);
    }

    return response.send(clientConfig);
  };
}

router.get('/locationFrontend', getClientConfigRoute('locationFrontend'));
router.get(
  '/healthDepartmentFrontend',
  requireHealthDepartmentEmployee,
  getClientConfigRoute('healthDepartmentFrontend')
);
router.get('/webapp', getClientConfigRoute('webapp'));
router.get('/ios', getClientConfigRoute('ios'));
router.get('/android', getClientConfigRoute('android'));
router.get('/operatorApp', getClientConfigRoute('operatorApp'));
export default router;
