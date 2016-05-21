/**
 * Created by Christian Schuhmacher on 21.05.2016.
 */
    
export declare class NotificationsService {
    success(title: string, content: string, override?: any)

    error(title: string, content: string, override?: any)

    alert(title: string, content: string, override?: any)

    info(title: string, content: string, override?: any)

    bare(title: string, content: string, override?: any)

    create(title: string, content: string, type: string, override?: any)

    html(html: any, type: string, override?: any)

    remove(id?: string)
}
