# Commandes Réseau 🌐

Voici les équivalences des commandes réseau courantes entre Linux et Windows.

| Fonctionnalité             | Linux Commande(s)         | Windows Commande(s)     |
|----------------------------|---------------------------|-------------------------|
| Afficher configuration IP  | `ip addr show` ou `ifconfig` | `ipconfig`              |
| Tester connectivité        | `ping [destination]`      | `ping [destination]`    |
| Tracer route               | `traceroute [destination]` | `tracert [destination]` |
| Résolution DNS             | `dig [domaine]` ou `nslookup [domaine]` | `nslookup [domaine]`    |
| Afficher routes réseau     | `ip route show` ou `netstat -r` | `route print` ou `netstat -r` |
| État des connexions réseau | `netstat -tulnp` (TCP/UDP/listening/process/numeric) | `netstat -ano` (Active/Numeric/Process ID) | 