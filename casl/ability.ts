import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export type Actions = 'manage' | 'read' | 'update' | 'delete';
export type Subjects = 'User';

export const defineAbilitiesFor = (role: string) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (role === 'admin') {
    can('manage', 'User');
  } else {
    can('read', 'User');
    can('update', 'User');
    cannot('delete', 'User');
  }

  return build({
    detectSubjectType: () => 'User',
  });
};